import { Linking, Platform } from 'react-native';
import appConfig from '../../app.json';

// GitHub Repository Configuration
export const GITHUB_REPO = {
  owner: 'Nikhil62738',
  repo: 'Eklakshya',
};

// Current App Version from app.json
export const CURRENT_VERSION = appConfig.expo?.version || '1.0.0';

/**
 * Semver comparison: returns true if vLatest > vCurrent
 * Handles 'v1.0.1', '1.0.1', 'v1.1.0-beta', etc.
 */
export const isNewerVersion = (latestTag, currentTag) => {
  const clean = (v) => (v || '').replace(/^v/i, '').trim();
  const latestParts = clean(latestTag).split('.').map((p) => parseInt(p, 10) || 0);
  const currentParts = clean(currentTag).split('.').map((p) => parseInt(p, 10) || 0);

  const len = Math.max(latestParts.length, currentParts.length);
  for (let i = 0; i < len; i++) {
    const l = latestParts[i] || 0;
    const c = currentParts[i] || 0;
    if (l > c) return true;
    if (l < c) return false;
  }
  return false;
};

/**
 * Check for updates against GitHub Releases API
 * GET https://api.github.com/repos/{owner}/{repo}/releases/latest
 */
export const checkForAppUpdate = async () => {
  const url = `https://api.github.com/repos/${GITHUB_REPO.owner}/${GITHUB_REPO.repo}/releases/latest`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'GrouSave-Mobile-App',
      },
    });

    if (response.status === 404) {
      // No release published yet
      return {
        updateAvailable: false,
        currentVersion: CURRENT_VERSION,
        message: 'No releases published yet on GitHub repository.',
      };
    }

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const release = await response.json();
    const latestVersion = release.tag_name || release.name;
    const updateAvailable = isNewerVersion(latestVersion, CURRENT_VERSION);

    // Look for an APK asset in the release
    const apkAsset = release.assets?.find(
      (a) => a.name.endsWith('.apk') || a.content_type === 'application/vnd.android.package-archive'
    );

    // Prefer direct APK download link, fallback to release HTML page
    const downloadUrl = apkAsset?.browser_download_url || release.html_url;

    // Check if marked mandatory in notes
    const isMandatory = (release.body || '').includes('[MANDATORY]');

    return {
      updateAvailable,
      currentVersion: CURRENT_VERSION,
      latestVersion,
      releaseName: release.name || latestVersion,
      releaseNotes: release.body || 'Performance improvements and bug fixes.',
      downloadUrl,
      releaseUrl: release.html_url,
      apkSize: apkAsset?.size ? `${Math.round(apkAsset.size / (1024 * 1024))} MB` : null,
      publishedAt: release.published_at,
      isMandatory,
    };
  } catch (error) {
    console.warn('[UpdateService] Check update error:', error.message);
    return {
      updateAvailable: false,
      currentVersion: CURRENT_VERSION,
      error: error.message,
    };
  }
};

/**
 * Open Download / Release URL in external browser
 */
export const openUpdateLink = async (downloadUrl) => {
  try {
    const supported = await Linking.canOpenURL(downloadUrl);
    if (supported) {
      await Linking.openURL(downloadUrl);
    } else {
      console.warn('[UpdateService] Cannot open URL:', downloadUrl);
    }
  } catch (err) {
    console.error('[UpdateService] Failed to open update link:', err);
  }
};

