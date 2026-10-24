# Quick Services Academy — Video Production & Deployment Guide

This guide details the recording specifications, software tools, nomenclature, and linking workflow for all course video lessons.

---

## 1. Video Production Standard

| Parameter | Specification |
|---|---|
| **Resolution** | 1080p Full HD (1920 × 1080) |
| **Aspect Ratio** | 16:9 Widescreen |
| **Frame Rate** | 30 FPS or 60 FPS |
| **Video Codec** | H.264 / MP4 or WebM |
| **Audio Standard** | Integrated Loudness: -16 LUFS (Stereo 48 kHz / 24-bit AAC) |
| **Spoken Pace** | 125 to 135 words per minute (optimal for second-language comprehension) |

---

## 2. Recommended Free Tools

- **Screen Recording & Streaming**: [OBS Studio](https://obsproject.com/) (Open Broadcaster Software) with noise gate and compressor filters.
- **Audio Editing & Leveling**: [Audacity](https://www.audacityteam.org/) with Loudness Normalization to -16 LUFS.
- **Video Editing**: [CapCut Desktop](https://www.capcut.com/) or [DaVinci Resolve](https://www.blackmagicdesign.com/products/davinciresolve) (Free Version).
- **Subtitles & Captions**: Whisper AI (e.g. via Buzz or Subtitle Edit) exporting `.vtt` or `.srt` files.

---

## 3. Video Naming & Tracking Protocol

All production assets are cataloged in `videos/tracker.csv`.
- **Naming Formula**: `V-{COURSE_CODE}-{NUMBER}.mp4`
  - Examples: `V-THESIS-01.mp4`, `V-SPSS-04.mp4`, `V-PLS-02.mp4`
- **Script Files**: Stored in `video-scripts/` matching the video ID:
  - Example: `video-scripts/V-THESIS-01.md`

---

## 4. How to Link Recorded Videos in Lessons

Once a video is recorded, hosted, or uploaded:
1. Open the lesson JSON file in `data/lessons/<course>/<lesson-id>.json`.
2. Locate the `"url"` key in the content object.
3. Paste the public URL into `"url"`:
   - **Direct MP4/WebM**: `"url": "https://pub-your-bucket.r2.dev/V-THESIS-01.mp4"` (Plays in native HTML5 custom player with playback speed and caption tracks).
   - **YouTube Unlisted**: `"url": "https://www.youtube.com/watch?v=XXXX"` (Embeds via privacy-enhanced `youtube-nocookie.com`).
   - **Vimeo**: `"url": "https://vimeo.com/XXXX"` (Embeds via Vimeo player).
   - **Google Drive**: `"url": "https://drive.google.com/file/d/XXXX/view"` (Renders responsive preview embed).
4. Update `videos/tracker.csv`:
   - Change `status` from `script ready` to `recorded` or `live`.
   - Update `url` with the live video link.
