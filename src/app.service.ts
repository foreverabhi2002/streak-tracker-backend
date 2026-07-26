import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Welcome to Learn In Public Streak Tracker Backend</title>

          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }

            body {
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              overflow: hidden;
              position: relative;
              background: #ffffff;
            }

            /* Blue Glow Background */
            body::before {
              content: "";
              position: absolute;
              inset: 0;
              background: radial-gradient(
                circle at top center,
                rgba(70, 130, 180, 0.5),
                transparent 70%
              );
              filter: blur(80px);
              z-index: 0;
            }

            main {
              position: relative;
              z-index: 1;
              display: flex;
              flex-direction: column;
              align-items: center;
              text-align: center;
            }

            h1 {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 0.1em;
              margin: 0;
              line-height: 0.95;
              font-family: Inter, system-ui, sans-serif;
              font-weight: 800;
              letter-spacing: -0.04em;
              text-align: center;
            }

            h1 span:first-child {
              font-size: clamp(2.5rem, 6vw, 4rem);
              color: #111827;
            }

            h1 .highlight {
              font-size: clamp(3rem, 7vw, 5rem);
              background: linear-gradient(90deg, #2563eb, #60a5fa);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
            }

            a {
              color: #2563eb;
              font-size: 1.5rem;
              text-decoration: none;
            }
              
            .docs-btn {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              gap: 0.6rem;

              margin-top: 2rem;
              padding: 0.9rem 1.6rem;

              font-size: 1rem;
              font-weight: 600;
              color: #fff;
              text-decoration: none;

              background: linear-gradient(135deg, #2563eb, #3b82f6);
              border: 1px solid rgba(37, 99, 235, 0.2);
              border-radius: 999px;

              box-shadow:
                0 10px 25px rgba(37, 99, 235, 0.25),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);

              transition: all 0.25s ease;
            }

            .docs-btn:hover {
              transform: translateY(-2px);
              box-shadow:
                0 16px 35px rgba(37, 99, 235, 0.35),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
            }

            .docs-btn:active {
              transform: translateY(0);
            }

            .docs-btn::after {
              content: "→";
              transition: transform 0.25s ease;
            }

            .docs-btn:hover::after {
              transform: translateX(4px);
            }
          </style>
        </head>

        <body>
          <main>
            <h1>
              <span>Learn in Public</span>
              <span class="highlight">Streak Tracker API</span>
            </h1>
            <a href="/docs" class="docs-btn">
              📚 API Documentation
            </a>
          </main>
        </body>
      </html>`;
  }
}
