import { group } from 'console';
import React, { useRef, useEffect, useState } from 'react'
import { store } from '../util/store'

/* Init */
BoneAnimator.addChannel("variant", { name: "Variant" })
new Property(KeyframeDataPoint, 'string', 'variant', { label: "Variant", condition: point => 'variant' == point.keyframe.channel });


function updateDisplay(state, cube) {
    Texture.all.forEach((tex) => tex.updateMaterial())
    const changes = Object.keys(state)

    if (changes.length == 0) {
        Canvas.updateView({ elements: [cube] });
    } else {
        for (let i = 0; i < changes.length; i++) {
            const to = state[changes[i]]
            const from = changes[i]

            cube.mesh.material = Project.materials[to]
            cube.mesh.material.map.needsUpdate = true

        }
    }
}

function updateVariantsRender(animation) {
    const states = store.get('states') || { default: {} }
    const _states = Object.keys(states).sort((a, b) => a.localeCompare(b));
    const selectedIndex = store.get('selectedIndex') || 0
    const selectedState = states[_states[selectedIndex]]

    const groupDepth = [];

    for (const group of Group.all) {
        function getDepth(group, depth) {
            if (group.parent == "root") {
                return depth
            } else {
                return getDepth(group.parent, ++depth)
            }
        }
        groupDepth.push({ uuid: group.uuid, depth: getDepth(group, 0)})
    }

    groupDepth.sort((a,b) => a.depth - b.depth);

    for (const groupObj of groupDepth) {
        const animator = animation.animators[groupObj.uuid]

        const currentTime = Timeline.time
        let smallestTime = Infinity
        let kfCandidate

        if (typeof animator.variant != "undefined") {
            for (let i = 0; i < animator.variant.length; i++) {
                const currentKeyframe = animator.variant[i]
    
                const kfTime = currentKeyframe.time
                const timeDelta = currentTime - kfTime
    
                if (timeDelta < 0) continue
    
                if (timeDelta < smallestTime) {
                    smallestTime = timeDelta
                    kfCandidate = currentKeyframe
                }
            }
        }
        
        const parentGroup = animator.group
        if (typeof kfCandidate != "undefined") {
            const stateName = kfCandidate.data_points[0].variant;
            const kfState = states[stateName]

            parentGroup.stateInfo = {state: stateName, frameID: currentTime }
            parentGroup.forEachChild((child) => {
                if (child instanceof Cube) {
                    if (typeof kfState != "undefined") {
                        updateDisplay(kfState, child)
                    }
                } else if (child instanceof Group) {
                    animation.animators[child.uuid].group.stateInfo = {state: stateName, frameID: currentTime }
                }
                

            })
        } else if (Object.hasOwn(parentGroup, "stateInfo") && parentGroup.stateInfo.frameID == currentTime && parentGroup.stateInfo.state) {
            parentGroup.children.forEach((child) => {
                if (child instanceof Cube) updateDisplay(selectedState, child)
            })
        }
    }
}

Blockbench.on('update_keyframe_selection', () => Timeline.updateSize())
Blockbench.on('display_animation_frame', () => {
    if (Modes.selected.id != "animate") return

    const states = store.get('states') || { default: {} }
    const _states = Object.keys(states).sort((a, b) => a.localeCompare(b));
    const selectedIndex = store.get('selectedIndex') || 0
    const selectedState = states[_states[selectedIndex]]

    const groupDepth = [];

    for (const group of Group.all) {
        function getDepth(group, depth) {
            if (group.parent == "root") {
                return depth
            } else {
                return getDepth(group.parent, ++depth)
            }
        }
        groupDepth.push({ uuid: group.uuid, depth: getDepth(group, 0)})
    }

    groupDepth.sort((a,b) => a.depth - b.depth);

    try {
        for (const groupObj of groupDepth) {
            const animator = Animation.selected.animators[groupObj.uuid]
    
            const currentTime = Timeline.time
            let smallestTime = Infinity
            let kfCandidate
    
            if (typeof animator.variant != "undefined") {
                for (let i = 0; i < animator.variant.length; i++) {
                    const currentKeyframe = animator.variant[i]
        
                    const kfTime = currentKeyframe.time
                    const timeDelta = currentTime - kfTime
        
                    if (timeDelta < 0) continue
        
                    if (timeDelta < smallestTime) {
                        smallestTime = timeDelta
                        kfCandidate = currentKeyframe
                    }
                }
            }
            
            const parentGroup = animator.group
            if (typeof kfCandidate != "undefined") {
                const stateName = kfCandidate.data_points[0].variant;
                const kfState = states[stateName]
    
                parentGroup.stateInfo = {state: stateName, frameID: currentTime }
                parentGroup.forEachChild((child) => {
                    if (child instanceof Cube) {
                        if (typeof kfState != "undefined") {
                            updateDisplay(kfState, child)
                        }
                    } else if (child instanceof Group) {
                        Animation.selected.animators[child.uuid].stateInfo = {state: stateName, frameID: currentTime }
                    }
                    
    
                })
            } else if (Object.hasOwn(parentGroup, "stateInfo") && parentGroup.stateInfo.frameID == currentTime && parentGroup.stateInfo.state) {
                parentGroup.children.forEach((child) => {
                    if (child instanceof Cube) updateDisplay(selectedState, child)
                })
            }
        }
    } catch (e) {}
    
})

Blockbench.on('select_mode',(data) => {
    if (data.mode.id != "animate") {
        const states = store.get('states') || { default: {} }
        const _states = Object.keys(states).sort((a, b) => a.localeCompare(b));
        const selectedIndex = store.get('selectedIndex') || 0
        const selectedState = states[_states[selectedIndex]]

        for (let i = 0; i < Cube.all.length; i++) {
            updateDisplay(selectedState, Cube.all[i])
        }
    }
})

export { updateVariantsRender }