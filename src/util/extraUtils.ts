import * as path from "path/posix"
import * as fs from 'fs'

export function getModelExportFolder(settings) {
    let fileName = Project.save_path.replace(/\\/g, '/').split('/').pop()
    let dirPath = Project.save_path.slice(0, -fileName.length - 1)

	dirPath = path.normalize(dirPath);

    const modelsPath = settings.animatedJava.rigModelsExportFolder

    // Dirty way
    fs.mkdirSync(modelsPath, { recursive: true })

    return modelsPath
}

export function toJson(object: any) : string {
    // @ts-ignore
    return compileJSON(object, {small: true})
}