import { __awaiter } from "tslib";
import path from 'path';
import { DirectoryCleaner, DirectoryCopier, FileCopier, PackageCreator, VersionWriter, TypeScriptCompiler, JavaScriptMinifier, StylizedLogger, gl_installer, readPackageJson, } from 'pack.gl';
const CONFIG = {
    path: {
        src: './src',
        dist: './dist',
        svg_input: './src/svg',
        svg_output: './dist/svg',
        sprite_input: './dist/svg',
        sprite_output: './dist/sprite',
        font_input: './dist/svg',
        font_output: './dist/font',
        scss_input: './src/scss',
        scss_output: './dist/scss',
        css_output: './dist/css',
        json_output: './dist',
        ts_input: './src/ts',
        ts_output: './dist/ts',
        ts_output_icons: './src/ts/icons',
        js_output: './dist/js',
        jinja_input: './src/jinja',
        jinja_output: './dist/jinja',
    },
};
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const logger = new StylizedLogger();
            logger.header('Install .gl libraries');
            yield gl_installer();
            const directoryCleaner = new DirectoryCleaner();
            logger.header('Clean Directories');
            directoryCleaner.cleanDirectory(CONFIG.path.dist);
            logger.body(`Directory cleaned: ${CONFIG.path.dist}`);
            const localPackageConfig = yield readPackageJson('./package.json');
            const packageCreator = new PackageCreator(localPackageConfig);
            const packageConfig = packageCreator.config;
            packageCreator.createPackageJson(CONFIG.path.dist);
            const fileCopier = new FileCopier();
            fileCopier.copyFileToDirectory(path.join('.', 'README.md'), CONFIG.path.dist);
            fileCopier.copyFileToDirectory(path.join('.', 'LICENSE'), CONFIG.path.dist);
            fileCopier.copyFileToDirectory(path.join('.', 'LICENSE-CODE'), CONFIG.path.dist);
            const directoryCopier = new DirectoryCopier();
            console.log('Files copied successfully.');
            yield directoryCopier.recursiveCopy(CONFIG.path.jinja_input, CONFIG.path.jinja_output);
            console.log('Files copied successfully.');
            const versionWriter = new VersionWriter();
            yield versionWriter.writeVersionToFile('VERSION', packageConfig.version);
            const tsCompiler = new TypeScriptCompiler();
            const tsFiles = [
                path.join(CONFIG.path.ts_input, 'index.ts'),
            ];
            const outputDir = './dist/js';
            yield tsCompiler.compile(tsFiles, outputDir);
            const jsMinifier = new JavaScriptMinifier();
            yield jsMinifier.minifyFile(path.join(CONFIG.path.js_output, 'index.js'), path.join(CONFIG.path.js_output, `${packageConfig.name}.min.js`))
                .then(() => console.log('JavaScript minification completed.'))
                .catch(console.error);
        }
        catch (error) {
            console.error('An error occurred:', error);
        }
    });
}
main();
//# sourceMappingURL=index.js.map