import { test, expect } from '@playwright/test';

let NETWORK_PRESETS = {
  lentao: {
    offline: false,
    downloadThroughput: (750 * 1024) / 8,
    uploadThroughput: (450 * 1024) / 8,
    latency: 100,
  },
  lento: {
    offline: false,
    downloadThroughput: (1.5 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
    latency: 40,
  },
  medio: {
    offline: false,
    downloadThroughput: (4 * 1024 * 1024) / 8,
    uploadThroughput: (3 * 1024 * 1024) / 8,
    latency: 20,
  },
  rapido: {
    offline: false,
    downloadThroughput: (30 * 1024 * 1024) / 8,
    uploadThroughput: (15 * 1024 * 1024) / 8,
    latency: 2,
  },
};

test.beforeEach(async ({ page }) => {
  await page.route(/collect/, async (route, request) => {
    await route.abort();
  });
});

test.setTimeout(120000);

const preset: string = process.env.PRESET!;

test(`TRELA redirect test - ${preset}`, async ({ page, context }, testInfo) => {
  const url =
    'https://www.trela.com.br/inicio/1?gclid=Cj0KCQjwmvSoBhDOARIsAK6aV7iouO27F9-i1ovPI4JjZSrgfOcyRiLkW0cWD-KEioLspEA4CUtWCUEaAhFXEALw_wcB';

  const collectDlQueries: string[] = [];

  page.on('request', request => {
    const url = request.url();
    if (url.includes('collect') && !url.includes('G-B7J2MMKRP1') /*error wrapper*/) {
      const dlQuery: string = new URLSearchParams(url.split('?')[1]).get('dl')!;
      collectDlQueries.push(decodeURIComponent(dlQuery));
    }
  });

  const client = await context.newCDPSession(page);
  await client.send('Network.enable');
  await client.send('Network.emulateNetworkConditions', NETWORK_PRESETS[preset]);

  await page.goto(url, { waitUntil: 'networkidle', referer: 'https://www.google.com/' });
  // await page.waitForTimeout(6000);

  await testInfo.attach('collects dl query', {
    body: JSON.stringify(collectDlQueries, null, 2),
  });

  expect(collectDlQueries.length).toBeLessThan(3);
  collectDlQueries.forEach(dl => expect(dl).toEqual(url));
});
