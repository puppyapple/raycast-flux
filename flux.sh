#!/bin/bash

# Required parameters:
# @raycast.schemaVersion 1
# @raycast.title Flux
# @raycast.mode fullOutput

# Optional parameters:
# @raycast.icon 🌌
# @raycast.argument1 { "type": "text", "placeholder": "Prompt" }
# @raycast.argument2 { "type": "text", "placeholder": "Model, width, height(dev 1024 1024)" }
# @raycast.argument3 { "type": "text", "placeholder": "Step", "optional": true }

# Documentation:
# @raycast.author puppyapple
# @raycast.authorURL https://raycast.com/puppyapple

prompt=$1
model_and_size=$2
# split model and size
model=$(echo $model_and_size | cut -d' ' -f1)
width=$(echo $model_and_size | cut -d' ' -f2)
height=$(echo $model_and_size | cut -d' ' -f3)
steps=$3
model_path=""

if [ -z "$steps" ]; then
    if [ "$model" == "dev" ]; then
        steps=20
    elif [ "$model" == "schnell" ]; then
        steps=4
    elif [ "$model" == "shuttle" ]; then
        steps=4
        model="schnell"
        model_path="/Users/zijunwu/.cache/huggingface/hub/models--shuttleai--shuttle-3-diffusion/snapshots/0e3400097d2a47041592d764e81491ca44f474c3/"
    else
        echo "Unknown model: $model"
        exit 1
    fi
fi

# hash the prompt with shorthash
hash=$(echo "$prompt" | shorthash)

# timestamp in seconds
output_path="/Users/zijunwu/Pictures/Diffusion/${model}_steps${steps}_${hash}_${timestamp}.png"

# use path if provided
if [ -n "$model_path" ]; then
    /Users/zijunwu/miniconda3/envs/bigmodel/bin/mflux-generate --prompt "$prompt" \
        --path $model_path \
        --model $model \
        --steps $steps \
        --width $width \
        --height $height \
        --output $output_path
else
    /Users/zijunwu/miniconda3/envs/bigmodel/bin/mflux-generate --prompt "$prompt" \
        --model $model \
        --steps $steps \
        --width $width \
        --height $height \
        --output $output_path
fi
wait
if [ -f "$output_path" ]; then
    open $output_path
fi
