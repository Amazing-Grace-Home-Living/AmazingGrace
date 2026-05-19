import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  // Use relative asset paths so the site works on GitHub Pages PR previews
  // (pr-<number>/ subdirectory URLs) as well as on the production domain.
  base: "./",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main:              resolve(__dirname, "index.html"),
        contact:           resolve(__dirname, "contact/index.html"),
        matrix:            resolve(__dirname, "matrix.html"),
        arcade:            resolve(__dirname, "arcade/index.html"),
        arcadeStarMatrix:   resolve(__dirname, "arcade/star-matrix/index.html"),
        arcadeMatrix:      resolve(__dirname, "arcade/matrix-of-conscience/index.html"),
        matrixConscienceIndex: resolve(__dirname, "matrix-of-conscience/index.html"),
        arcadeCertificates: resolve(__dirname, "arcade/certificates/index.html"),
        arcadeBibleStudy:  resolve(__dirname, "arcade/bible-study/index.html"),
        arcadeMatrixClassic: resolve(__dirname, "arcade/matrix-classic.html"),
        arcadeMatrixDebug:   resolve(__dirname, "arcade/matrix-debug.html"),
        arcadeQuickClick:    resolve(__dirname, "arcade/quick-click/index.html"),
        arcadeTrinity:      resolve(__dirname, "arcade/trinity/index.html"),
        ministry:          resolve(__dirname, "ministry/index.html"),
        ministryBibleJourney: resolve(__dirname, "ministry/bible-journey.html"),
        ministryTheRedQueen:  resolve(__dirname, "ministry/the-red-queen.html"),
        ministries:             resolve(__dirname, "ministries/index.html"),
        ministriesSevenStarCanon: resolve(__dirname, "ministries/seven-star-canon.html"),
        stories:           resolve(__dirname, "stories/index.html"),
        storiesBlogArchitecturalSynthesis: resolve(__dirname, "stories/blog/architectural-js-synthesis.html"),
        storiesExposeMatrix: resolve(__dirname, "stories/expose-the-matrix/index.html"),
        storiesMatrix:      resolve(__dirname, "stories/matrix.html"),
        storiesNoahAndTheArk: resolve(__dirname, "stories/noah-and-the-ark/index.html"),
        storiesNexusPrime2087: resolve(__dirname, "stories/nexus-prime-2087/index.html"),
        storiesOurCovenant: resolve(__dirname, "stories/our-covenant-of-new-beginnings/index.html"),
        storiesFixingCopilotRulesetBypass: resolve(__dirname, "stories/fixing-copilot-ruleset-bypass-errors/index.html"),
        storiesGithubBypassSetupApp: resolve(__dirname, "stories/github-bypass-setup-app/index.html"),
        libraryIndex:                resolve(__dirname, "library/index.html"),
        libraryExposeMatrix:         resolve(__dirname, "library/expose-the-matrix/index.html"),
        libraryNoahAndTheArk:        resolve(__dirname, "library/noah-and-the-ark/index.html"),
        libraryAmazingGraceCovenant: resolve(__dirname, "library/amazing-grace-covenant/index.html"),
        libraryOurCovenant:          resolve(__dirname, "library/our-covenant-of-new-beginnings/index.html"),
        libraryFixingCopilot:        resolve(__dirname, "library/fixing-copilot-ruleset-bypass-errors/index.html"),
        libraryGithubBypass:         resolve(__dirname, "library/github-bypass-setup-app/index.html"),
        audioLibrary:        resolve(__dirname, "audio-library/index.html"),
        storiesLampInWindow: resolve(__dirname, "stories/books/the-lamp-in-the-window.html"),
        storiesElla:       resolve(__dirname, "stories/characters/ella.html"),
        matrixApp:         resolve(__dirname, "arcade/matrix-app/index.html"),
        news:              resolve(__dirname, "news/index.html"),
        newsZykoLearn:     resolve(__dirname, "news/articles/zyko-learn.html"),
        newsFutureArticles: resolve(__dirname, "news/articles/future-articles.html"),
        support:           resolve(__dirname, "support/index.html"),
        privacy:           resolve(__dirname, "privacy.html"),
        arcadeRedirect:    resolve(__dirname, "arcade.html"),
      }
    }
  }
});
