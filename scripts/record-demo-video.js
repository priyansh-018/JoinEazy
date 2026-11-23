const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const VIDEO_DIR = path.join(__dirname, '..', 'demo-video');

// Helper to pause execution with human-like pacing
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function recordDemo() {
  if (!fs.existsSync(VIDEO_DIR)) {
    fs.mkdirSync(VIDEO_DIR, { recursive: true });
  }

  console.log('========================================================');
  console.log('🎥 Starting JoinEazy Automated HD Demo Video Recording...');
  console.log('========================================================');

  const browser = await chromium.launch({
    channel: 'msedge',
    headless: false // Show browser so user can also watch it live!
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: {
      dir: VIDEO_DIR,
      size: { width: 1280, height: 720 }
    }
  });

  const page = await context.newPage();

  try {
    // ----------------------------------------------------
    // SCENE 1: Landing Page Walkthrough (Editorial Aesthetic)
    // ----------------------------------------------------
    console.log('[Scene 1/5] Recording Landing Page & Editorial Design...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await sleep(2500);

    // Smooth scroll down to highlight features
    await page.evaluate(async () => {
      const scrollStep = 8;
      const scrollDelay = 15;
      const maxScroll = document.body.scrollHeight;
      for (let y = 0; y < maxScroll - 700; y += scrollStep) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, scrollDelay));
      }
    });

    await sleep(1500);

    // Smooth scroll back to top
    await page.evaluate(async () => {
      const scrollStep = 25;
      const scrollDelay = 10;
      for (let y = window.scrollY; y > 0; y -= scrollStep) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, scrollDelay));
      }
      window.scrollTo(0, 0);
    });

    await sleep(1500);

    // ----------------------------------------------------
    // SCENE 2: Professor Workflow (Courses & Assignments)
    // ----------------------------------------------------
    console.log('[Scene 2/5] Recording Professor Workflow & Subject Isolation...');
    await page.click('text=SIGN IN');
    await page.waitForURL('**/login', { timeout: 10000 });
    await sleep(1200);

    // Fill professor credentials
    await page.fill('input[type="email"]', 'priyansh191983@gmail.com');
    await sleep(600);
    await page.fill('input[type="password"]', 'Prof@123');
    await sleep(800);
    await page.click('button[type="submit"]');

    // Land on subjects/courses
    await page.waitForTimeout(2000);
    await sleep(1800);

    // Click Assignments tab
    console.log('Navigating to Professor Assignments...');
    const assignmentsNav = await page.$('text=ASSIGNMENTS');
    if (assignmentsNav) {
      await assignmentsNav.click();
      await sleep(2000);
    }

    // ----------------------------------------------------
    // SCENE 3: Student Workflow & Team Collaboration
    // ----------------------------------------------------
    console.log('[Scene 3/5] Recording Student Team Collaboration & Email Dispatch...');
    // Log out professor
    const logoutBtn = await page.$('button[title="Sign Out"], button:has-text("Sign Out"), button:has(svg.lucide-log-out)');
    if (logoutBtn) {
      await logoutBtn.click();
    } else {
      await page.goto('http://localhost:3000/login');
    }
    await sleep(1500);

    // Log in as Student Virat
    await page.fill('input[type="email"]', 'patel.24bcy10389@vitbhopal.ac.in');
    await sleep(600);
    await page.fill('input[type="password"]', 'Student@123');
    await sleep(800);
    await page.click('button[type="submit"]');

    await page.waitForTimeout(2000);

    // Go to Groups page
    await page.goto('http://localhost:3000/groups', { waitUntil: 'networkidle' });
    await sleep(2000);

    // Invite peer by email
    const inviteInput = await page.$('input[placeholder*="email" i], input[placeholder*="student" i], input[type="text"]');
    if (inviteInput) {
      await inviteInput.fill('ruchicha.24bac10044@vitbhopal.ac.in');
      await sleep(1200);
      const inviteBtn = await page.$('button:has-text("INVITE")');
      if (inviteBtn) {
        await inviteBtn.click();
        await sleep(3500); // Allow success banner to display prominently
      }
    }

    // ----------------------------------------------------
    // SCENE 4: Two-Step Coursework Submission
    // ----------------------------------------------------
    console.log('[Scene 4/5] Recording Two-Step Assignment Submission...');
    await page.goto('http://localhost:3000/assignments', { waitUntil: 'networkidle' });
    await sleep(2000);

    // Click Submit Assignment
    const submitBtn = await page.$('button:has-text("SUBMIT ASSIGNMENT")');
    if (submitBtn) {
      await submitBtn.click();
      await sleep(1800);

      // Check step 1 and step 2 checkboxes
      const checkboxes = await page.$$('input[type="checkbox"]');
      for (const cb of checkboxes) {
        await cb.check();
        await sleep(600);
      }

      // Add notes
      const notesField = await page.$('textarea');
      if (notesField) {
        await notesField.fill('Complete coursework brief and validated code assets uploaded to designated cloud storage.');
        await sleep(1000);
      }

      // Complete submission
      const confirmSubmitBtn = await page.$('button:has-text("COMPLETE TWO-STEP SUBMISSION")');
      if (confirmSubmitBtn) {
        await confirmSubmitBtn.click();
        await sleep(3000);
      }
    }

    // ----------------------------------------------------
    // SCENE 5: Direct Support Modal & Conclusion
    // ----------------------------------------------------
    console.log('[Scene 5/5] Recording Help & Institutional Support Modal...');
    const helpBtn = await page.$('button:has-text("NEED HELP?"), div:has-text("NEED HELP?")');
    if (helpBtn) {
      await helpBtn.click();
      await sleep(2500);

      // Close modal
      const closeHelp = await page.$('button:has(svg.lucide-x)');
      if (closeHelp) {
        await closeHelp.click();
        await sleep(1200);
      }
    }

    await sleep(2000);
    console.log('✅ Walkthrough sequence completed successfully!');

  } catch (err) {
    console.error('Error during demo recording:', err);
  } finally {
    // Save video file
    await page.close();
    const video = page.video();
    await context.close();
    await browser.close();

    if (video) {
      const videoPath = await video.path();
      const finalDest = path.join(VIDEO_DIR, 'JoinEazy-Platform-Demo.webm');
      
      // Wait for file stream to finish flushing
      await sleep(1500);

      try {
        fs.copyFileSync(videoPath, finalDest);
        console.log('========================================================');
        console.log(`🎬 DEMO VIDEO SAVED SUCCESSFULLY!`);
        console.log(`📍 File Path: ${finalDest}`);
        console.log('========================================================');
      } catch (e) {
        console.log(`Video saved at original path: ${videoPath}`);
      }
    }
  }
}

recordDemo().catch(console.error);
