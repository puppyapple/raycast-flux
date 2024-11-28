import { Form, ActionPanel, Action, showToast, open, Toast, getPreferenceValues } from "@raycast/api";
import { exec } from "child_process";
import { promisify } from "util";
import { createHash } from "crypto";
import { homedir } from "os";
import { join } from "path";
import { readdirSync } from "fs";

const execAsync = promisify(exec);

type Values = {
    model: string;
    seed?: string;
    steps?: string;
    width: string;
    height: string;
    auto_preview: boolean;
    prompt: string;
};

interface Preferences {
    mfluxExecutablePath: string;
    savePath?: string;
}
const preferences = getPreferenceValues<Preferences>();

// 添加生成输出路径的辅助函数
function generateOutputPath(prompt: string, model: string, steps?: string, seed?: string): string {
    // 生成 prompt 的短哈希（取前 6 位）
    const promptHash = createHash('md5')
        .update(prompt)
        .digest('hex')
        .slice(0, 6);

    // 获取当前时间戳（秒级）
    const timestamp = Math.floor(Date.now() / 1000);

    // 构建文件名
    const fileName = [
        promptHash,
        model,
        steps ? `steps${steps}` : '',
        seed ? `seed${seed}` : '',
        timestamp
    ].filter(Boolean).join('-') + '.png';

    // 返回完整路径（默认保存在用户目录的 Pictures/Diffusion/mflux 文件夹下）
    if (preferences.savePath) {
        return join(preferences.savePath, fileName);
    } else {
        return join(homedir(), 'Pictures', 'Diffusion', 'mflux', fileName);
    }
}
// 自动获取snapshots文件夹下面的第一个文件夹
function getLatestSnapshot(model_folder: string) {
    const snapshotsDir = join(homedir(), '.cache', 'huggingface', 'hub', model_folder, 'snapshots');
    const snapshots = readdirSync(snapshotsDir);
    return join(snapshotsDir, snapshots[0]);
}

export default function Command() {
    async function handleSubmit(values: Values) {
        try {
            console.log("Form values:", values);

            const width = values.width || "1024";
            const height = values.height || "1024";
            const seedParam = values.seed ? `--seed ${values.seed}` : "";
            let pathParam = "";
            if (values.model === "shuttle") {
                pathParam = `--path ${getLatestSnapshot("models--shuttleai--shuttle-3-diffusion")}`;
            } else if (values.model === "schnell") {
                pathParam = `--path ${getLatestSnapshot("models--black-forest-labs--FLUX.1-schnell")}`;
            } else if (values.model === "dev") {
                pathParam = `--path ${getLatestSnapshot("models--black-forest-labs--FLUX.1-dev")}`;
            }
            let stepsParam = values.steps ? `--steps ${values.steps}` : "";

            if (!stepsParam) {
                if (values.model === "dev") {
                    stepsParam = "--steps 20";
                } else if (values.model === "schnell") {
                    stepsParam = "--steps 4";
                } else if (values.model === "shuttle") {
                    stepsParam = "--steps 4";
                }
            }

            // 获取实际的 steps 值（用于文件名）
            const stepsValue = stepsParam.split(' ')[1];

            // 生成输出路径
            const outputPath = generateOutputPath(values.prompt, values.model, stepsValue, values.seed);

            // 当模型为shuttle的时候，实际上要重新设置为schnell，但是要添加--path参数
            if (values.model === "shuttle") {
                values.model = "schnell";
            }

            const command = [
                preferences.mfluxExecutablePath,
                `--prompt "${values.prompt}"`,
                `--model ${values.model}`,
                `--width ${width}`,
                `--height ${height}`,
                seedParam,
                stepsParam,
                pathParam,
                `--output "${outputPath}"` // 添加输出路径参数
            ].filter(Boolean).join(" ");

            console.log("Executing command:", command);

            await showToast({
                title: "Processing",
                message: "Generating image...",
                style: Toast.Style.Animated,
            });

            const { stderr } = await execAsync(command);

            // if (stderr) {
            //     throw new Error(stderr);
            // }

            await showToast({
                title: "Success",
                message: "Image generated successfully",
                style: Toast.Style.Success
            });

            if (values.auto_preview) {
                console.log("Opening file:", outputPath);
                await open(outputPath);
            }
        } catch (error) {
            console.error("Error:", error);
            await showToast({
                title: "Error",
                message: String(error),
                style: Toast.Style.Failure
            });
        }
    }

    return (
        <Form
            actions={
                <ActionPanel>
                    <Action.SubmitForm onSubmit={handleSubmit} />
                </ActionPanel>
            }
        >
            <Form.TextArea
                id="prompt"
                title="Prompt"
                placeholder="Enter your prompt"
                enableMarkdown={false}
                autoFocus
            />
            <Form.Dropdown id="model" title="Model">
                <Form.Dropdown.Item value="shuttle" title="Shuttle" />
                <Form.Dropdown.Item value="schnell" title="Schnell" />
                <Form.Dropdown.Item value="dev" title="Dev" />
            </Form.Dropdown>
            <Form.TextField
                id="seed"
                title="Seed"
                placeholder="Optional: Enter seed number"
                info="Random seed for generation"
            />
            <Form.TextField
                id="steps"
                title="Steps"
                placeholder="4"
                defaultValue="4"
                info="Number of inference steps"
            />
            <Form.TextField
                id="width"
                title="Width"
                placeholder="1024"
                defaultValue="1024"
            />
            <Form.TextField
                id="height"
                title="Height"
                placeholder="1024"
                defaultValue="1024"
            />
            <Form.Checkbox
                id="auto_preview"
                label="Auto Preview"
                defaultValue={true}
            />
        </Form>
    );
} 