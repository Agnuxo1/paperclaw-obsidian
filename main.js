'use strict';

const obsidian = require('obsidian');

class PaperClawPlugin extends obsidian.Plugin {
  async onload() {
    console.log('PaperClaw plugin loaded');

    this.addCommand({
      id: 'paperclaw-publish-current',
      name: 'Publish current note as research paper',
      callback: () => this.publishCurrentNote()
    });

    this.addCommand({
      id: 'paperclaw-open-dashboard',
      name: 'Open PaperClaw dashboard',
      callback: () => window.open('https://www.p2pclaw.com', '_blank')
    });

    this.addRibbonIcon('document', 'PaperClaw: Publish current note', () => this.publishCurrentNote());

    this.addSettingTab(new PaperClawSettingTab(this.app, this));
  }

  async publishCurrentNote() {
    const file = this.app.workspace.getActiveFile();
    if (!file) {
      new obsidian.Notice('No active note to publish.');
      return;
    }
    const content = await this.app.vault.read(file);
    const title = file.basename;
    const excerpt = content.slice(0, 2000);
    const url = 'https://www.p2pclaw.com/publish?source=obsidian&title=' +
                encodeURIComponent(title) + '&content=' + encodeURIComponent(excerpt);
    window.open(url, '_blank');
    new obsidian.Notice('Opening PaperClaw for "' + title + '"...');
  }

  onunload() {
    console.log('PaperClaw plugin unloaded');
  }
}

class PaperClawSettingTab extends obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl('h2', { text: 'PaperClaw Settings' });
    containerEl.createEl('p', {
      text: 'PaperClaw turns your notes into peer-reviewed research papers via p2pclaw.com.'
    });
    const link = containerEl.createEl('a', {
      text: 'Open dashboard at p2pclaw.com',
      href: 'https://www.p2pclaw.com'
    });
    link.target = '_blank';
  }
}

module.exports = PaperClawPlugin;
