#!/usr/bin/env node

/**
 * Production Build Script
 * Minifies CSS and JavaScript files for production deployment
 */

const fs = require('fs').promises;
const path = require('path');

class ProductionBuilder {
    constructor() {
        this.buildResults = [];
        this.sourceDir = __dirname;
        this.buildDir = path.join(__dirname, 'dist');
    }

    /**
     * Run the complete production build
     */
    async build() {
        console.log('🏗️ Starting Production Build...');
        console.log('================================');
        
        try {
            // Create build directory
            await this.createBuildDirectory();
            
            // Copy HTML files
            await this.copyHTMLFiles();
            
            // Process and minify CSS files
            await this.processCSSFiles();
            
            // Process and minify JavaScript files
            await this.processJavaScriptFiles();
            
            // Copy and optimize images
            await this.processImages();
            
            // Copy data files
            await this.copyDataFiles();
            
            // Copy admin files
            await this.copyAdminFiles();
            
            // Copy API files
            await this.copyAPIFiles();
            
            // Generate build report
            this.generateBuildReport();
            
            console.log('\n🎉 Production build completed successfully!');
            
        } catch (error) {
            console.error('❌ Build failed:', error);
            process.exit(1);
        }
    }

    /**
     * Create build directory
     */
    async createBuildDirectory() {
        try {
            await fs.access(this.buildDir);
            // Directory exists, clean it
            await this.cleanDirectory(this.buildDir);
        } catch {
            // Directory doesn't exist, create it
            await fs.mkdir(this.buildDir, { recursive: true });
        }
        
        // Create subdirectories
        const subdirs = ['css', 'js', 'data', 'admin', 'api', 'uploads'];
        for (const subdir of subdirs) {
            await fs.mkdir(path.join(this.buildDir, subdir), { recursive: true });
        }
        
        this.addBuildResult('Directory Setup', 'Build directory created and cleaned');
    }

    /**
     * Clean directory recursively
     */
    async cleanDirectory(dir) {
        const files = await fs.readdir(dir);
        
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = await fs.stat(filePath);
            
            if (stat.isDirectory()) {
                await this.cleanDirectory(filePath);
                await fs.rmdir(filePath);
            } else {
                await fs.unlink(filePath);
            }
        }
    }

    /**
     * Copy HTML files with optimization
     */
    async copyHTMLFiles() {
        console.log('📄 Processing HTML files...');
        
        const htmlFiles = [
            'index.html',
            'page-contact.html',
            'page-history.html',
            'page-news.html',
            'page-services.html',
            'test-comprehensive.html',
            'test-interactive-features.html'
        ];
        
        let processedFiles = 0;
        
        for (const file of htmlFiles) {
            try {
                const content = await fs.readFile(path.join(this.sourceDir, file), 'utf8');
                const optimizedContent = this.optimizeHTML(content);
                await fs.writeFile(path.join(this.buildDir, file), optimizedContent);
                processedFiles++;
            } catch (error) {
                console.warn(`⚠️ Could not process ${file}:`, error.message);
            }
        }
        
        this.addBuildResult('HTML Processing', `${processedFiles} HTML files processed and optimized`);
    }

    /**
     * Optimize HTML content
     */
    optimizeHTML(content) {
        // Remove comments (except IE conditionals)
        content = content.replace(/<!--(?!\[if)[\s\S]*?-->/g, '');
        
        // Remove extra whitespace
        content = content.replace(/\s+/g, ' ');
        content = content.replace(/>\s+</g, '><');
        
        // Update script and CSS references to minified versions
        content = content.replace(/src="js\/([^"]+)\.js"/g, 'src="js/$1.min.js"');
        content = content.replace(/href="css\/([^"]+)\.css"/g, 'href="css/$1.min.css"');
        
        return content.trim();
    }

    /**
     * Process and minify CSS files
     */
    async processCSSFiles() {
        console.log('🎨 Processing CSS files...');
        
        const cssFiles = ['style.css', 'admin.css'];
        let processedFiles = 0;
        let totalSavings = 0;
        
        for (const file of cssFiles) {
            try {
                const sourcePath = path.join(this.sourceDir, 'css', file);
                const content = await fs.readFile(sourcePath, 'utf8');
                const originalSize = Buffer.byteLength(content, 'utf8');
                
                const minifiedContent = this.minifyCSS(content);
                const minifiedSize = Buffer.byteLength(minifiedContent, 'utf8');
                const savings = originalSize - minifiedSize;
                totalSavings += savings;
                
                // Write minified version
                const minFileName = file.replace('.css', '.min.css');
                await fs.writeFile(path.join(this.buildDir, 'css', minFileName), minifiedContent);
                
                // Also copy original for development
                await fs.writeFile(path.join(this.buildDir, 'css', file), content);
                
                processedFiles++;
                console.log(`  ✅ ${file} → ${minFileName} (${this.formatBytes(savings)} saved)`);
                
            } catch (error) {
                console.warn(`⚠️ Could not process CSS file ${file}:`, error.message);
            }
        }
        
        this.addBuildResult('CSS Minification', `${processedFiles} CSS files minified, ${this.formatBytes(totalSavings)} total savings`);
    }

    /**
     * Minify CSS content
     */
    minifyCSS(content) {
        // Remove comments
        content = content.replace(/\/\*[\s\S]*?\*\//g, '');
        
        // Remove extra whitespace
        content = content.replace(/\s+/g, ' ');
        
        // Remove whitespace around specific characters
        content = content.replace(/\s*{\s*/g, '{');
        content = content.replace(/;\s*/g, ';');
        content = content.replace(/}\s*/g, '}');
        content = content.replace(/,\s*/g, ',');
        content = content.replace(/:\s*/g, ':');
        
        // Remove trailing semicolons
        content = content.replace(/;}/g, '}');
        
        // Remove empty rules
        content = content.replace(/[^{}]+{\s*}/g, '');
        
        return content.trim();
    }

    /**
     * Process and minify JavaScript files
     */
    async processJavaScriptFiles() {
        console.log('⚡ Processing JavaScript files...');
        
        const jsFiles = [
            'main.js',
            'admin.js',
            'api.js',
            'homepage-content.js',
            'page-content.js',
            'json-manager.js',
            'interactive-features.js',
            'real-time-sync.js',
            'performance-optimizer.js',
            'test-implementations.js',
            'browser-compatibility-test.js',
            'visual-regression-test.js'
        ];
        
        let processedFiles = 0;
        let totalSavings = 0;
        
        for (const file of jsFiles) {
            try {
                const sourcePath = path.join(this.sourceDir, 'js', file);
                const content = await fs.readFile(sourcePath, 'utf8');
                const originalSize = Buffer.byteLength(content, 'utf8');
                
                const minifiedContent = this.minifyJavaScript(content);
                const minifiedSize = Buffer.byteLength(minifiedContent, 'utf8');
                const savings = originalSize - minifiedSize;
                totalSavings += savings;
                
                // Write minified version
                const minFileName = file.replace('.js', '.min.js');
                await fs.writeFile(path.join(this.buildDir, 'js', minFileName), minifiedContent);
                
                // Also copy original for development
                await fs.writeFile(path.join(this.buildDir, 'js', file), content);
                
                processedFiles++;
                console.log(`  ✅ ${file} → ${minFileName} (${this.formatBytes(savings)} saved)`);
                
            } catch (error) {
                console.warn(`⚠️ Could not process JS file ${file}:`, error.message);
            }
        }
        
        this.addBuildResult('JavaScript Minification', `${processedFiles} JavaScript files minified, ${this.formatBytes(totalSavings)} total savings`);
    }

    /**
     * Minify JavaScript content (basic minification)
     */
    minifyJavaScript(content) {
        // Remove single-line comments (but preserve URLs and regex)
        content = content.replace(/\/\/(?![^\n]*['"`]).*$/gm, '');
        
        // Remove multi-line comments
        content = content.replace(/\/\*[\s\S]*?\*\//g, '');
        
        // Remove extra whitespace
        content = content.replace(/\s+/g, ' ');
        
        // Remove whitespace around operators and punctuation
        content = content.replace(/\s*([{}();,=+\-*/<>!&|])\s*/g, '$1');
        
        // Remove whitespace after keywords
        content = content.replace(/\b(if|for|while|function|return|var|let|const|class|new)\s+/g, '$1 ');
        
        // Restore necessary spaces
        content = content.replace(/}else/g, '} else');
        content = content.replace(/}catch/g, '} catch');
        content = content.replace(/}finally/g, '} finally');
        
        return content.trim();
    }

    /**
     * Process and optimize images
     */
    async processImages() {
        console.log('🖼️ Processing images...');
        
        // For now, just copy images as-is
        // In a real production environment, you'd use image optimization tools
        try {
            const uploadsExists = await fs.access(path.join(this.sourceDir, 'uploads')).then(() => true).catch(() => false);
            
            if (uploadsExists) {
                await this.copyDirectory(
                    path.join(this.sourceDir, 'uploads'),
                    path.join(this.buildDir, 'uploads')
                );
                this.addBuildResult('Image Processing', 'Images copied to build directory');
            } else {
                // Create empty uploads directory
                await fs.mkdir(path.join(this.buildDir, 'uploads'), { recursive: true });
                this.addBuildResult('Image Processing', 'Empty uploads directory created');
            }
        } catch (error) {
            console.warn('⚠️ Could not process images:', error.message);
        }
    }

    /**
     * Copy data files
     */
    async copyDataFiles() {
        console.log('📊 Copying data files...');
        
        try {
            await this.copyDirectory(
                path.join(this.sourceDir, 'data'),
                path.join(this.buildDir, 'data')
            );
            this.addBuildResult('Data Files', 'JSON data files copied to build directory');
        } catch (error) {
            console.warn('⚠️ Could not copy data files:', error.message);
        }
    }

    /**
     * Copy admin files
     */
    async copyAdminFiles() {
        console.log('👨‍💼 Copying admin files...');
        
        try {
            await this.copyDirectory(
                path.join(this.sourceDir, 'admin'),
                path.join(this.buildDir, 'admin')
            );
            
            // Optimize admin HTML files
            const adminHtmlFiles = await fs.readdir(path.join(this.buildDir, 'admin'));
            for (const file of adminHtmlFiles) {
                if (file.endsWith('.html')) {
                    const filePath = path.join(this.buildDir, 'admin', file);
                    const content = await fs.readFile(filePath, 'utf8');
                    const optimizedContent = this.optimizeHTML(content);
                    await fs.writeFile(filePath, optimizedContent);
                }
            }
            
            this.addBuildResult('Admin Files', 'Admin files copied and optimized');
        } catch (error) {
            console.warn('⚠️ Could not copy admin files:', error.message);
        }
    }

    /**
     * Copy API files
     */
    async copyAPIFiles() {
        console.log('🔌 Copying API files...');
        
        try {
            await this.copyDirectory(
                path.join(this.sourceDir, 'api'),
                path.join(this.buildDir, 'api')
            );
            this.addBuildResult('API Files', 'API files copied to build directory');
        } catch (error) {
            console.warn('⚠️ Could not copy API files:', error.message);
        }
    }

    /**
     * Copy directory recursively
     */
    async copyDirectory(src, dest) {
        await fs.mkdir(dest, { recursive: true });
        const files = await fs.readdir(src);
        
        for (const file of files) {
            const srcPath = path.join(src, file);
            const destPath = path.join(dest, file);
            const stat = await fs.stat(srcPath);
            
            if (stat.isDirectory()) {
                await this.copyDirectory(srcPath, destPath);
            } else {
                await fs.copyFile(srcPath, destPath);
            }
        }
    }

    /**
     * Add build result
     */
    addBuildResult(step, message) {
        this.buildResults.push({
            step: step,
            message: message,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Format bytes to human readable format
     */
    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Generate build report
     */
    generateBuildReport() {
        console.log('\n📊 Production Build Report');
        console.log('==========================');
        
        this.buildResults.forEach(result => {
            console.log(`✅ ${result.step}: ${result.message}`);
        });
        
        console.log(`\n📁 Build output: ${this.buildDir}`);
        console.log(`🕒 Build completed: ${new Date().toLocaleString()}`);
        
        // Create build info file
        const buildInfo = {
            buildDate: new Date().toISOString(),
            buildResults: this.buildResults,
            sourceDirectory: this.sourceDir,
            buildDirectory: this.buildDir
        };
        
        fs.writeFile(
            path.join(this.buildDir, 'build-info.json'),
            JSON.stringify(buildInfo, null, 2)
        ).catch(console.error);
    }
}

// Run build if this script is executed directly
if (require.main === module) {
    const builder = new ProductionBuilder();
    builder.build().catch(console.error);
}

module.exports = ProductionBuilder;