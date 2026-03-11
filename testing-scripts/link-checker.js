#!/usr/bin/env node

/**
 * Essentials Creative Website Link Checker
 * Automated testing script for navigation consistency and link validation
 */

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

class LinkChecker {
    constructor() {
        this.baseDir = process.cwd();
        this.results = {
            totalTests: 0,
            passed: 0,
            failed: 0,
            issues: []
        };
        this.knownIssues = {
            brokenVideoLinks: [],
            inconsistentProjectLinks: [],
            missingPages: [],
            navigationInconsistencies: []
        };
    }

    async runAllTests() {
        console.log('🔍 Starting Essentials Creative Link Checker...\n');
        
        // Get all HTML files
        const htmlFiles = this.getHtmlFiles();
        console.log(`Found ${htmlFiles.length} HTML files to test\n`);

        // Test each file
        for (const file of htmlFiles) {
            console.log(`Testing ${file}...`);
            await this.testFile(file);
        }

        // Generate report
        this.generateReport();
        this.saveResults();
    }

    getHtmlFiles() {
        const files = fs.readdirSync(this.baseDir);
        return files.filter(file => 
            file.endsWith('.html') && 
            !file.startsWith('.') &&
            !file.includes('404') &&
            !file.includes('error')
        );
    }

    async testFile(filename) {
        try {
            const filePath = path.join(this.baseDir, filename);
            const content = fs.readFileSync(filePath, 'utf8');
            const $ = cheerio.load(content);
            
            // Test navigation links
            this.testNavigationLinks($, filename);
            
            // Test internal links
            this.testInternalLinks($, filename);
            
            // Test images
            this.testImages($, filename);
            
            // Test forms
            this.testForms($, filename);
            
            // Test specific known issues
            this.testKnownIssues($, filename);
            
            console.log(`✅ ${filename} - Basic tests completed`);
            
        } catch (error) {
            this.addIssue('CRITICAL', `${filename}: Failed to parse file`, error.message);
            console.log(`❌ ${filename} - Failed to test`);
        }
    }

    testNavigationLinks($, filename) {
        // Test main navigation
        const navLinks = $('nav .nav-link, .nav-links a');
        const expectedNavStructure = [
            { text: 'Home', href: 'index.html' },
            { text: 'Photography', href: 'photography.html' },
            { text: 'Design', href: 'design.html' },
            { text: 'Video/Film', href: 'projections.html' }, // Critical: NOT #video
            { text: 'Installations', href: 'installations.html' },
            { text: 'Projects', href: 'yanaguana.html' }, // Should be consistent
            { text: 'About', href: 'about.html' },
            { text: 'Contact', href: 'contact.html' }
        ];

        navLinks.each((i, element) => {
            const $link = $(element);
            const href = $link.attr('href');
            const text = $link.text().trim();
            
            this.results.totalTests++;
            
            // Test for known critical issue: #video links
            if (text.includes('Video') || text.includes('Film')) {
                if (href === '#video') {
                    this.addIssue('CRITICAL', 
                        `${filename}: Video/Film links to #video instead of projections.html`,
                        `Navigation link "${text}" has broken href="${href}"`
                    );
                    this.knownIssues.brokenVideoLinks.push(filename);
                    this.results.failed++;
                } else if (href === 'projections.html') {
                    this.results.passed++;
                } else {
                    this.addIssue('HIGH', 
                        `${filename}: Video/Film link has unexpected href`,
                        `Expected "projections.html", got "${href}"`
                    );
                    this.results.failed++;
                }
            }
            
            // Test for Projects link consistency
            if (text.includes('Projects')) {
                if (href === 'yanaguana.html') {
                    this.results.passed++;
                } else if (href === 'rhizomatic.html') {
                    this.addIssue('HIGH', 
                        `${filename}: Projects links to rhizomatic.html instead of yanaguana.html`,
                        'Projects navigation should be consistent across all pages'
                    );
                    this.knownIssues.inconsistentProjectLinks.push(filename);
                    this.results.failed++;
                } else {
                    this.addIssue('MEDIUM', 
                        `${filename}: Projects link has unexpected href`,
                        `Expected "yanaguana.html", got "${href}"`
                    );
                    this.results.failed++;
                }
            }
            
            // Test internal links exist
            if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto:')) {
                const targetFile = path.join(this.baseDir, href);
                if (!fs.existsSync(targetFile)) {
                    this.addIssue('HIGH', 
                        `${filename}: Broken internal link`,
                        `Link to "${href}" - file does not exist`
                    );
                    this.knownIssues.missingPages.push(href);
                    this.results.failed++;
                } else {
                    this.results.passed++;
                }
            }
        });

        // Test mobile navigation consistency
        const mobileLinks = $('.hamburger-menu a, .hamburger-link');
        if (mobileLinks.length > 0 && navLinks.length > 0) {
            if (mobileLinks.length !== navLinks.length) {
                this.addIssue('MEDIUM', 
                    `${filename}: Mobile and desktop navigation mismatch`,
                    `Desktop: ${navLinks.length} links, Mobile: ${mobileLinks.length} links`
                );
                this.results.failed++;
            } else {
                this.results.passed++;
            }
        }
    }

    testInternalLinks($, filename) {
        const allLinks = $('a[href]');
        
        allLinks.each((i, element) => {
            const $link = $(element);
            const href = $link.attr('href');
            
            // Skip external links and anchors
            if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
                return;
            }
            
            // Skip hash-only links (for now, though #video is problematic)
            if (href.startsWith('#') && href !== '#video') {
                return;
            }
            
            this.results.totalTests++;
            
            // Test #video specifically as it's a known issue
            if (href === '#video') {
                this.addIssue('CRITICAL', 
                    `${filename}: Found #video link`,
                    'This link will not work - should link to projections.html'
                );
                this.results.failed++;
                return;
            }
            
            // Test file exists
            const cleanHref = href.split('#')[0]; // Remove anchor part
            if (cleanHref) {
                const targetFile = path.join(this.baseDir, cleanHref);
                if (!fs.existsSync(targetFile)) {
                    this.addIssue('HIGH', 
                        `${filename}: Broken link to ${cleanHref}`,
                        `Target file does not exist`
                    );
                    this.results.failed++;
                } else {
                    this.results.passed++;
                }
            }
        });
    }

    testImages($, filename) {
        const images = $('img[src]');
        
        images.each((i, element) => {
            const $img = $(element);
            const src = $img.attr('src');
            const alt = $img.attr('alt');
            
            this.results.totalTests++;
            
            // Test image file exists
            if (!src.startsWith('http')) {
                const imagePath = path.join(this.baseDir, src);
                if (!fs.existsSync(imagePath)) {
                    this.addIssue('HIGH', 
                        `${filename}: Missing image`,
                        `Image "${src}" not found`
                    );
                    this.results.failed++;
                } else {
                    this.results.passed++;
                }
            }
            
            // Test alt text exists (accessibility)
            if (!alt || alt.trim() === '') {
                this.addIssue('MEDIUM', 
                    `${filename}: Missing alt text`,
                    `Image "${src}" has no alt attribute`
                );
                this.results.failed++;
            } else {
                this.results.passed++;
            }
        });
    }

    testForms($, filename) {
        const forms = $('form');
        
        forms.each((i, element) => {
            const $form = $(element);
            const action = $form.attr('action');
            const method = $form.attr('method');
            
            this.results.totalTests++;
            
            // Test form has action
            if (!action) {
                this.addIssue('HIGH', 
                    `${filename}: Form missing action`,
                    'Form will not submit without action attribute'
                );
                this.results.failed++;
            } else if (action.includes('formspree.io')) {
                // Formspree forms are expected
                this.results.passed++;
            } else {
                this.results.passed++;
            }
            
            // Test form has method
            if (!method) {
                this.addIssue('MEDIUM', 
                    `${filename}: Form missing method`,
                    'Form should specify POST method'
                );
                this.results.failed++;
            } else {
                this.results.passed++;
            }
        });
    }

    testKnownIssues($, filename) {
        // Test for specific navigation structure consistency
        const hasLogo = $('.logo').length > 0;
        const hasHamburger = $('.hamburger-nav, .hamburger-toggle').length > 0;
        
        this.results.totalTests++;
        
        // Pages should have consistent header structure
        if (filename !== 'shop.html') { // Shop page may be different
            if (!hasLogo || !hasHamburger) {
                this.addIssue('MEDIUM', 
                    `${filename}: Inconsistent header structure`,
                    `Logo: ${hasLogo}, Mobile menu: ${hasHamburger}`
                );
                this.knownIssues.navigationInconsistencies.push(filename);
                this.results.failed++;
            } else {
                this.results.passed++;
            }
        }
        
        // Test hero section consistency (if has hero)
        const heroH1 = $('.hero h1, .project-hero h1');
        if (heroH1.length > 0) {
            this.results.totalTests++;
            // Basic test - hero should have h1
            this.results.passed++;
        }
    }

    addIssue(severity, title, description) {
        this.results.issues.push({
            severity,
            title,
            description,
            timestamp: new Date().toISOString()
        });
    }

    generateReport() {
        console.log('\n' + '='.repeat(60));
        console.log('📊 ESSENTIALS CREATIVE LINK CHECKER RESULTS');
        console.log('='.repeat(60));
        
        const passRate = ((this.results.passed / this.results.totalTests) * 100).toFixed(1);
        
        console.log(`Total Tests: ${this.results.totalTests}`);
        console.log(`✅ Passed: ${this.results.passed}`);
        console.log(`❌ Failed: ${this.results.failed}`);
        console.log(`📈 Pass Rate: ${passRate}%`);
        
        console.log('\n🚨 CRITICAL ISSUES:');
        const criticalIssues = this.results.issues.filter(i => i.severity === 'CRITICAL');
        if (criticalIssues.length === 0) {
            console.log('✅ No critical issues found');
        } else {
            criticalIssues.forEach(issue => {
                console.log(`❌ ${issue.title}`);
                console.log(`   ${issue.description}`);
            });
        }
        
        console.log('\n⚠️  HIGH PRIORITY ISSUES:');
        const highIssues = this.results.issues.filter(i => i.severity === 'HIGH');
        if (highIssues.length === 0) {
            console.log('✅ No high priority issues found');
        } else {
            highIssues.forEach(issue => {
                console.log(`⚠️  ${issue.title}`);
                console.log(`   ${issue.description}`);
            });
        }
        
        // Summary of known issues
        console.log('\n📋 KNOWN ISSUE SUMMARY:');
        console.log(`🔗 Pages with broken #video links: ${this.knownIssues.brokenVideoLinks.length}`);
        if (this.knownIssues.brokenVideoLinks.length > 0) {
            console.log(`   Files: ${this.knownIssues.brokenVideoLinks.join(', ')}`);
        }
        
        console.log(`📁 Pages with inconsistent Projects links: ${this.knownIssues.inconsistentProjectLinks.length}`);
        if (this.knownIssues.inconsistentProjectLinks.length > 0) {
            console.log(`   Files: ${this.knownIssues.inconsistentProjectLinks.join(', ')}`);
        }
        
        console.log(`📄 Missing pages referenced: ${[...new Set(this.knownIssues.missingPages)].length}`);
        if (this.knownIssues.missingPages.length > 0) {
            console.log(`   Files: ${[...new Set(this.knownIssues.missingPages)].join(', ')}`);
        }
        
        console.log('\n' + '='.repeat(60));
        
        if (criticalIssues.length > 0) {
            console.log('🚨 CRITICAL ISSUES DETECTED - IMMEDIATE ACTION REQUIRED');
        } else if (this.results.failed > 0) {
            console.log('⚠️  ISSUES DETECTED - PLEASE REVIEW AND FIX');
        } else {
            console.log('✅ ALL TESTS PASSED - WEBSITE LOOKS GOOD!');
        }
        
        console.log('='.repeat(60));
    }

    saveResults() {
        const reportData = {
            timestamp: new Date().toISOString(),
            summary: {
                totalTests: this.results.totalTests,
                passed: this.results.passed,
                failed: this.results.failed,
                passRate: ((this.results.passed / this.results.totalTests) * 100).toFixed(1)
            },
            issues: this.results.issues,
            knownIssues: this.knownIssues
        };
        
        const reportPath = path.join(this.baseDir, 'testing-scripts', 'reports', 'link-check-report.json');
        
        // Ensure reports directory exists
        const reportsDir = path.dirname(reportPath);
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir, { recursive: true });
        }
        
        fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
        console.log(`\n📄 Detailed report saved to: ${reportPath}`);
    }
}

// Run the link checker if called directly
if (require.main === module) {
    const checker = new LinkChecker();
    checker.runAllTests().catch(console.error);
}

module.exports = LinkChecker;