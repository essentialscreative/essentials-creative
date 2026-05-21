#!/usr/bin/env node

/**
 * Essentials Creative Daily Gallery & Lightbox Checker
 * Automatically verifies gallery functionality and lightbox integration daily
 * Run with: node daily-gallery-checker.js
 * Schedule with cron: 0 9 * * * cd /path/to/site && node daily-gallery-checker.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const SITE_ROOT = '/Volumes/Extreme SSD/EssentialsCreative.COM/DEPLOY_TO_NETLIFY';
const GALLERY_PAGES = [
    'photography.html',
    'design.html',
    'video.html',
    'installations.html',
    'rhizomatic.html',
    'yanaguana.html',
    'afterworld.html'
];

const REQUIRED_LIGHTBOX_FILES = [
    'assets/js/enhanced-lightbox.js',
    'assets/css/enhanced-lightbox.css',
    'assets/js/unified-gallery-lightbox.js'
];

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[36m',
    bold: '\x1b[1m'
};

class GalleryLightboxChecker {
    constructor() {
        this.issues = [];
        this.warnings = [];
        this.stats = {
            pagesChecked: 0,
            galleriesFound: 0,
            lightboxImplementations: 0,
            dynamicGalleries: 0,
            brokenImages: [],
            missingLightbox: []
        };
    }

    // Check if lightbox files exist
    checkLightboxFiles() {
        console.log(`\n${colors.blue}Checking Lightbox Files...${colors.reset}`);
        
        for (const file of REQUIRED_LIGHTBOX_FILES) {
            const filePath = path.join(SITE_ROOT, file);
            if (fs.existsSync(filePath)) {
                console.log(`  ${colors.green}✓${colors.reset} ${file} exists`);
            } else {
                // Only flag as warning since unified-gallery-lightbox.js might be optional
                if (file.includes('unified')) {
                    this.warnings.push({
                        type: 'missing_optional_file',
                        file: file,
                        message: `Optional lightbox file not found: ${file}`
                    });
                    console.log(`  ${colors.yellow}⚠${colors.reset} ${file} not found (optional)`);
                } else {
                    this.issues.push({
                        type: 'missing_file',
                        file: file,
                        message: `Required lightbox file not found: ${file}`
                    });
                    console.log(`  ${colors.red}✗${colors.reset} ${file} missing!`);
                }
            }
        }
    }

    // Check individual page
    async checkPage(fileName) {
        const filePath = path.join(SITE_ROOT, fileName);
        
        if (!fs.existsSync(filePath)) {
            console.log(`${colors.yellow}⚠ Page not found: ${fileName}${colors.reset}`);
            return;
        }

        const content = fs.readFileSync(filePath, 'utf-8');
        this.stats.pagesChecked++;

        console.log(`\n${colors.blue}Checking: ${fileName}${colors.reset}`);

        // Check for lightbox CSS
        const hasLightboxCSS = content.includes('enhanced-lightbox.css') || 
                               content.includes('lightbox.css');
        
        // Check for lightbox JS
        const hasLightboxJS = content.includes('enhanced-lightbox.js') || 
                             content.includes('unified-gallery-lightbox.js') ||
                             content.includes('initLightbox');

        // Check for gallery elements
        const hasGallery = content.includes('gallery-grid') || 
                          content.includes('gallery-item') ||
                          content.includes('installations-grid') ||
                          content.includes('video-grid');

        // Check for lightbox triggers
        const hasLightboxTrigger = content.includes('lightbox-trigger') ||
                                  content.includes('onclick="openLightbox') ||
                                  content.includes('data-lightbox');

        // Check for dynamic gallery (JS-generated)
        const hasDynamicGallery = content.includes('renderPhotos') ||
                                  content.includes('renderDesigns') ||
                                  content.includes('renderVideos') ||
                                  content.includes('shufflePhotos') ||
                                  content.includes('shuffleDesigns');

        // Report findings
        if (hasGallery) {
            this.stats.galleriesFound++;
            console.log(`  ${colors.green}✓${colors.reset} Gallery found`);
            
            if (hasDynamicGallery) {
                this.stats.dynamicGalleries++;
                console.log(`  ${colors.green}✓${colors.reset} Dynamic gallery detected`);
                
                // Check if lightbox is re-initialized after dynamic content
                if (!content.includes('window.initLightbox') && !content.includes('initLightbox()')) {
                    this.issues.push({
                        page: fileName,
                        type: 'dynamic_lightbox',
                        message: 'Dynamic gallery may not re-initialize lightbox after content changes'
                    });
                    console.log(`  ${colors.yellow}⚠${colors.reset} Dynamic gallery may need lightbox re-initialization`);
                }
            }
        }

        if (hasLightboxCSS && hasLightboxJS) {
            this.stats.lightboxImplementations++;
            console.log(`  ${colors.green}✓${colors.reset} Lightbox properly loaded`);
        } else {
            if (!hasLightboxCSS) {
                this.stats.missingLightbox.push(fileName);
                console.log(`  ${colors.red}✗${colors.reset} Missing lightbox CSS`);
            }
            if (!hasLightboxJS) {
                this.stats.missingLightbox.push(fileName);
                console.log(`  ${colors.red}✗${colors.reset} Missing lightbox JS`);
            }
        }

        if (hasGallery && !hasLightboxTrigger) {
            this.warnings.push({
                page: fileName,
                type: 'no_triggers',
                message: 'Gallery found but no lightbox triggers detected'
            });
            console.log(`  ${colors.yellow}⚠${colors.reset} Gallery without lightbox triggers`);
        }

        // Check for broken image references
        this.checkImages(fileName, content);
    }

    // Check for broken images
    checkImages(fileName, content) {
        const imgRegex = /<img[^>]+src=["']([^"']+)["']/g;
        let match;
        let brokenCount = 0;

        while ((match = imgRegex.exec(content)) !== null) {
            const imgSrc = match[1];
            
            // Skip external URLs and data URIs
            if (imgSrc.startsWith('http') || imgSrc.startsWith('data:')) {
                continue;
            }

            const imgPath = path.join(SITE_ROOT, imgSrc);
            if (!fs.existsSync(imgPath)) {
                brokenCount++;
                this.stats.brokenImages.push({
                    page: fileName,
                    image: imgSrc
                });
            }
        }

        if (brokenCount > 0) {
            console.log(`  ${colors.red}✗${colors.reset} ${brokenCount} broken image(s) found`);
        }
    }

    // Apply automatic fixes where possible
    async applyFixes() {
        if (this.issues.length === 0 && this.warnings.length === 0) {
            return;
        }

        console.log(`\n${colors.yellow}Applying Automatic Fixes...${colors.reset}`);

        for (const issue of this.issues) {
            if (issue.type === 'dynamic_lightbox') {
                // Fix dynamic galleries to re-initialize lightbox
                const filePath = path.join(SITE_ROOT, issue.page);
                let content = fs.readFileSync(filePath, 'utf-8');
                
                // Check if the render function exists
                if (content.includes('renderPhotos') && !content.includes('window.initLightbox')) {
                    // Add lightbox re-initialization after render
                    content = content.replace(
                        /gallery\.style\.opacity = '1';/g,
                        `gallery.style.opacity = '1';
        
        // Re-initialize lightbox for new images
        if (window.initLightbox) {
            window.initLightbox();
        }`
                    );
                    
                    fs.writeFileSync(filePath, content);
                    console.log(`  ${colors.green}✓${colors.reset} Fixed lightbox re-initialization in ${issue.page}`);
                }
            }
        }
    }

    // Generate daily report
    generateReport() {
        const timestamp = new Date().toISOString();
        
        console.log('\n' + '='.repeat(60));
        console.log(`${colors.bold}DAILY GALLERY & LIGHTBOX CHECK REPORT${colors.reset}`);
        console.log(`${colors.blue}Timestamp: ${timestamp}${colors.reset}`);
        console.log('='.repeat(60));

        console.log(`\n${colors.blue}📊 Statistics:${colors.reset}`);
        console.log(`  Pages checked: ${this.stats.pagesChecked}`);
        console.log(`  Galleries found: ${this.stats.galleriesFound}`);
        console.log(`  Lightbox implementations: ${this.stats.lightboxImplementations}`);
        console.log(`  Dynamic galleries: ${this.stats.dynamicGalleries}`);

        // Status determination
        const hasIssues = this.issues.length > 0 || this.stats.brokenImages.length > 0;
        const hasWarnings = this.warnings.length > 0;

        if (!hasIssues && !hasWarnings) {
            console.log(`\n${colors.green}✅ ALL SYSTEMS OPERATIONAL${colors.reset}`);
            console.log('All galleries and lightbox implementations are functioning correctly.');
        } else {
            if (this.issues.length > 0) {
                console.log(`\n${colors.red}❌ Critical Issues Found:${colors.reset}`);
                this.issues.forEach(issue => {
                    console.log(`  • ${issue.page || 'Global'}: ${issue.message}`);
                });
            }

            if (this.stats.brokenImages.length > 0) {
                console.log(`\n${colors.red}🖼️  Broken Images:${colors.reset}`);
                this.stats.brokenImages.forEach(item => {
                    console.log(`  • ${item.page}: ${item.image}`);
                });
            }

            if (this.warnings.length > 0) {
                console.log(`\n${colors.yellow}⚠️  Warnings:${colors.reset}`);
                this.warnings.forEach(warning => {
                    console.log(`  • ${warning.page || 'Global'}: ${warning.message}`);
                });
            }
        }

        // Save report to file
        this.saveReport(timestamp, hasIssues, hasWarnings);

        console.log('\n' + '='.repeat(60));
        
        if (hasIssues) {
            console.log(`${colors.red}${colors.bold}ACTION REQUIRED: Please review and fix the issues above${colors.reset}`);
        } else if (hasWarnings) {
            console.log(`${colors.yellow}${colors.bold}ATTENTION: Some warnings need review${colors.reset}`);
        } else {
            console.log(`${colors.green}${colors.bold}✅ No action needed - all systems healthy${colors.reset}`);
        }
    }

    // Save report to log file
    saveReport(timestamp, hasIssues, hasWarnings) {
        const logDir = path.join(SITE_ROOT, 'logs');
        
        // Create logs directory if it doesn't exist
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }

        const logFile = path.join(logDir, 'gallery-lightbox-checks.log');
        const reportData = {
            timestamp,
            status: hasIssues ? 'ISSUES' : hasWarnings ? 'WARNINGS' : 'OK',
            stats: this.stats,
            issues: this.issues,
            warnings: this.warnings,
            brokenImages: this.stats.brokenImages
        };

        // Append to log file
        fs.appendFileSync(logFile, JSON.stringify(reportData) + '\n');
        console.log(`\nReport saved to: ${logFile}`);
    }

    // Main execution
    async run() {
        console.log(`${colors.bold}🖼️  Essentials Creative Gallery & Lightbox Daily Check${colors.reset}`);
        console.log('='.repeat(60));

        // Check lightbox files
        this.checkLightboxFiles();

        // Check each gallery page
        for (const page of GALLERY_PAGES) {
            await this.checkPage(page);
        }

        // Apply automatic fixes
        await this.applyFixes();

        // Generate report
        this.generateReport();
    }
}

// Run the checker
const checker = new GalleryLightboxChecker();
checker.run().catch(console.error);