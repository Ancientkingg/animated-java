import { ObjectSpaceNormalMap } from 'three'
import type * as aj from '../animatedJava'
import { CustomError } from '../util/customError'
import { tl } from '../util/intl'
import { roundToN } from '../util/misc'
interface PHAnimationExporterSettings {
	outputJsonPath: string
}

function roundScale(scale) {
	return {
		x: roundToN(scale.x, 1000),
		y: roundToN(scale.y, 1000),
		z: roundToN(scale.z, 1000),
	}
}

function rawExport(exportData: any) {
	const ajSettings = exportData.settings.animatedJava
	const exporterSettings = exportData.settings
		.PHAnimationExporter as PHAnimationExporterSettings
	Object.keys(exportData.animations).forEach((animation) => {
		exportData.animations[animation].frames.forEach((frame) => {
			Object.keys(frame.bones).forEach((bone) => {
				// 6. / 16. & 22. / 16.
				frame.bones[bone].pos.x = roundToN(frame.bones[bone].pos.x, 1000)
				frame.bones[bone].pos.y = roundToN(frame.bones[bone].pos.y + -1.813, 1000)
				frame.bones[bone].pos.z = roundToN(frame.bones[bone].pos.z, 1000)

				frame.bones[bone].rot.x = roundToN(frame.bones[bone].rot.x, 1000)
				frame.bones[bone].rot.y = roundToN(frame.bones[bone].rot.y, 1000)
				frame.bones[bone].rot.z = roundToN(frame.bones[bone].rot.z, 1000)

				const scale = roundScale(frame.bones[bone].scale)
				const vecStr = `${scale.x}-${scale.y}-${scale.z}`

				delete frame.bones[bone].scale
				
				const variantName = frame.bones[bone].variant
				try {
					if (variantName == "") {
						frame.bones[bone].custom_model_data = exportData.scaleModels[bone][vecStr].aj.customModelData
					} else {
						frame.bones[bone].custom_model_data = exportData.variantModels[variantName][`${bone}_${vecStr}`].aj.customModelData
					}
				} catch (e) {
					if (variantName == "") {
						frame.bones[bone].custom_model_data = exportData.models[bone].aj.customModelData
					} else {
						frame.bones[bone].custom_model_data = exportData.variantModels[variantName][bone].aj.customModelData
					}
				}
				
			});
		});
	});

	const stateNames = Object.keys(exportData.variantModels)

	let variantOffset = 0

	if (Object.keys(exportData.scaleModels).length == 0) {
		// check `models`
		variantOffset = Object.keys(exportData.models).length
	} else {
		for (const bone of Object.values(exportData.scaleModels)) {
			variantOffset += Object.keys(bone).length + 1
		}
 	}



	const FILE = {
		meta: {
			head_item: ajSettings.rigItem,
			variant: {
				variants: stateNames,
				offset: variantOffset
			}
		},
		animations: exportData.animations,
	}

	if (!exporterSettings.outputJsonPath) {
		throw new CustomError(
			'animatedJava.exporters.rawAnimation.dialogs.errors.outputJsonPathUndefined.title',
			{
				intentional: true,
				dialog: {
					id: 'animatedJava.exporters.rawAnimation.dialogs.errors.outputJsonPathUndefined',
					title: tl(
						'animatedJava.exporters.rawAnimation.dialogs.errors.outputJsonPathUndefined.title'
					),
					lines: [
						tl(
							'animatedJava.exporters.rawAnimation.dialogs.errors.outputJsonPathUndefined.body'
						),
					],
					width: 512,
					singleButton: true,
				},
			}
		)
	}

	Blockbench.writeFile(exporterSettings.outputJsonPath, {
		content: JSON.stringify(FILE, null, '\t'),
		custom_writer: null,
	})
}

const genericEmptySettingText = tl(
	'animatedJava.settings.generic.errors.emptyValue'
)

const Exporter = (AJ: any) => {
	AJ.settings.registerPluginSettings(
		'animatedJava.exporters.PHAnimation', // Exporter ID
		'PHAnimationExporter', // Exporter Settings Key
		{
			outputJsonPath: {
				title: tl(
					'animatedJava.exporters.rawAnimation.settings.outputJsonPath.title'
				),
				description: tl(
					'animatedJava.exporters.rawAnimation.settings.outputJsonPath.description'
				),
				type: 'filepath',
				default: '',
				optional: true,
				props: {
					dialogOpts: {
						get defaultPath() {
							return `output.json`
						},
						promptToCreate: true,
						properties: ['openFile'],
					},
				},
				onUpdate(d: aj.SettingDescriptor) {
					if (d.value === '') {
						d.isValid = false
						d.error = genericEmptySettingText
					}
					return d
				},
			},
		}
	)
	AJ.registerExportFunc('PHAnimationExporter', function () {
		AJ.build(
			(exportData: aj.ExportData) => {
				console.log('Input Data:', exportData)
				rawExport(exportData)
			},
			{
				generate_static_animation: true,
			}
		)
	})
}

if (Reflect.has(window, 'ANIMATED_JAVA')) {
	Exporter(window['ANIMATED_JAVA'])
} else {
	// @ts-ignore
	Blockbench.on('animated-java-ready', Exporter)
}
