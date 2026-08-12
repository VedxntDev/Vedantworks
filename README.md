# Personal Portfolio: VEDANT.

A premium, interactive React + TypeScript + Vite portfolio website featuring an animated grid beam background, custom coding stats cards, and a fully functional blog section.

## Features

- **Animated Grid Beams Background**: Responsive canvas-based grid background featuring animated green glowing laser beams sweeping along axis intersections.
- **Architectural Drafting Aesthetic**: Intersecting grid lines extending from sections and the profile photo, complete with continuous horizontal and vertical glowing laser sweeps.
- **Interactive Project Previews**: Custom CLI terminal mockups popping up next to project cards on hover, typing commands and executing outputs in real-time.
- **Priority Coding Stats**: Custom, unified dark-theme heatmaps and contribution calendars stacked in order: takeUforward heatmap, GitHub contributions, and LeetCode activity.
- **Interactive Blog View**: Single-page state-based blog routing to read, search, and expand detailed technical articles.
- **Responsive & Brand-Colored Socials**: Hand-styled brand links (LinkedIn blue, X light-blue, Gmail red, PDF red) with an animated lens shine flare on the Resume button.

## How to Run

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the local dev server:
   ```bash
   npm run dev
   ```
3. Compile for production:
   ```bash
   npm run build
   ```

---

## Prompts Timeline

Below are all the developer prompts in chronological order that were used to build this portfolio:

1. **Initialize App**:
   > Initialize a new React application using Vite, React, and TypeScript. Create a portfolio website for me, take inspiration from https://www.kanakk.me/
2. **Setup Initial Bio & Avatar**:
   > Instead of logo img add Vedant. instead, my name is Vedant Singh Baghel, and in about me section redefine "I am 2nd year College student, learning and building Full stack web applications using Internet frameworks, I like building and solving complex problems" and instead of profile pic add attached media, optimize it according to required dimensions requirement
3. **Configure DP & Navigation**:
   > Done make dp black and white and instead of all the options in nav bar, add only the option of contact me and blog
4. **Update Main Biography**:
   > Change bio to: "I'm a second-year Computer Science student and aspiring Full-Stack Developer who enjoys building software, solving complex problems, and learning how modern technologies work together. I work with JavaScript, Java, Python, C, React, Node.js, Next.js, MongoDB, MySQL, DBMS, CSS, and Tailwind CSS, MERN stack. I'm particularly interested in building scalable web applications and understanding the engineering decisions behind reliable, maintainable software. I enjoy taking on challenging problems, experimenting with new technologies, and turning ideas into practical solutions. I'm currently looking for opportunities where I can contribute, learn from experienced developers, and work on challenging problems that push me to grow. **Interested in software development, full-stack engineering, and building things that solve real problems.**"
5. **Trim Bio & Sync Content from Linkfolio**:
   > Trim the bio, make it short its too long, and change the ui/ux design language, i dont like the blend of blue/purple change it make it more subtle and move the socials section up a little copy social links and projects and experience from https://linkfolio.cv/vedant
6. **Add FlyRankAI & Adjust Colors**:
   > Add one more experience of FlyRankAI as Ai frontend intern from august 2026 to present, add working with js, node.js, react, tailwind and other frontend framework and said to make ui / ux design subtle not black and white, change that make it more lively, prev one was good but change that blue/purple to some other color ui and make that dp colored again i dont like black and white version
7. **Add DP Grid Lines & Glow Bar**:
   > And add design like this have next to dp, make it more lively, add some subtle pattern in bg, i dont want some plain black and white portfolio (attached Kanak Kumar profile layout reference showing intersecting gridlines and a gradient top glow sweep)
8. **Section Gridlines, Uppercase Header & Project Hover Previews**:
   > Change heading to uppercase VEDANT. I liked the continuous line striking around dp, make more use of components like those, make the website more livid and original site ex had a unique feature in projects where whenever hovered it pops the live preview of project next to it, and make it mobile responsive too
9. **Integrate Coding Stats & Blog Routing**:
   > Add github activity graph of https://github.com/VedxntDev leetcode submission graph of https://leetcode.com/u/vedxntdev/ and make blog page fully fetched and add a dummy blog
10. **Align Stats Heatmap Styles**:
    > No i want leetcode submission graph similar to u hv of github and it should be full width
11. **TUF Heatmap & Spotify Removal**:
    > Remove the stats of how many question i hv solved in leetcode and can u add activity heatmap of https://takeuforward.org/profile/vedxnt603 also similar to leetcode and github and remove the spotify feature of the portfolio
12. **Stats Priority Order & Laser Sweeps**:
    > I also liked the effect thats happening continuously around dp, i want to add more continuous motion effects like these around the website and the priority order should be takeuforward, github (make it dark themed like other), leetcode
13. **Resume PDF & Hover Lens Flare**:
    > Also add the section of resume pdf along with other socials and attach this pdf, also add special effect when hovered over resume button
14. **Brand-Colored Social Icons & Briefcase Symbols**:
    > Change the color of icons of social, i want colorful icons of social media rather than black nd white ones and change the icon of experience ones also they look too ai
15. **Background Beams Grid & Footer Copyright**:
    > Can u also add hero section with continuous beam and grid effect and at last its 2026@ vedant singh baghel i just want vedant there
16. **Verified Redirect Destinations**:
    > In email section it should redirect to vedantsinghbaghelsocial@gmail.com and check linkedin link redirects to www.linkedin.com/in/vedantsbaghel only
17. **Refined Canvas Animated Beams**:
    > Add this beam bg component GridBeams (using HTML canvas grid points, dot nodes, and randomized green-teal laser beam updates)
18. **Browser Mail Redirection**:
    > When clicked upon email it doesnt redirect to vedantsinghbaghelsocial@gmail.com (updated with target="_blank" and rel="noopener noreferrer" for standard external client routing)
19. **Prompts Documentation**:
    > Add all the prompts used to make this website in README.md
