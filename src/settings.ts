import { 
    App,
    PluginSettingTab,
    Setting,
} from 'obsidian';
import Foodiary from './main';

export interface FoodiarySettings {
    showProductFolderTitles: boolean;
    groupEntriesByTitles: boolean;
	productsFolder: string;
    propertyCalories: string;
    propertyProtein: string;
    propertyFat: string;
    propertyCarbs: string;
}

export const DEFAULT_SETTINGS: FoodiarySettings = {
    showProductFolderTitles: true,
    groupEntriesByTitles: true,
	productsFolder: "Products",
    propertyCalories: "calories",
    propertyProtein: "protein",
    propertyFat: "fat",
    propertyCarbs: "carbs",
}

export class FoodiarySettingTab extends PluginSettingTab {
	plugin: Foodiary;

	constructor(app: App, plugin: Foodiary){
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

        new Setting(containerEl)
            .setName('Show product folder titles')
            .setDesc('Enable this option if you want to see product titles as they set in the products folder, instead of product titles you enter in a code block. For example, "apple 100" will be shown as "Apples 100" since the its file in the folder named "Apples.md".')
            .addToggle(text => text
                .setValue(this.plugin.settings.showProductFolderTitles)
                .onChange(async (value) => {
                    this.plugin.settings.showProductFolderTitles = value;
                    await this.plugin.saveSettings();
                }));                

        new Setting(containerEl)
            .setName('Group entries by titles')
            .setDesc('If enabled, entries in the code block will be grouped by a title. For instance, "Apple 100" and "Apple 150" will be calculated as "Apple 250".')
            .addToggle(text => text
                .setValue(this.plugin.settings.groupEntriesByTitles)
                .onChange(async (value) => {
                    this.plugin.settings.groupEntriesByTitles = value;
                    await this.plugin.saveSettings();
                }));                

        new Setting(containerEl).setName('Products').setHeading();

		new Setting(containerEl)
			.setName('Products folder')
			.setDesc('Path to the folder with information about products you eat.')
			.addText(text => text
				.setPlaceholder(DEFAULT_SETTINGS.productsFolder.toString())
				.setValue(this.plugin.settings.productsFolder.toString())
				.onChange(async (value) => {
                    value = value.trim();
                    if (value == "") {
                        value = DEFAULT_SETTINGS.productsFolder
                    }
                    this.plugin.settings.productsFolder = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Property for calories')
			.setDesc('Property of products folder files that contains number of calories.')
			.addText(text => text
				.setPlaceholder(DEFAULT_SETTINGS.propertyCalories.toString())
				.setValue(this.plugin.settings.propertyCalories.toString())
				.onChange(async (value) => {
                    value = value.trim();
                    if (value == "") {
                        value = DEFAULT_SETTINGS.propertyCalories
                    }
                    this.plugin.settings.propertyCalories = value;
					await this.plugin.saveSettings();
				}));

        new Setting(containerEl)
            .setName('Property for protein')
            .setDesc('Property of products folder files that contains number of protein.')
            .addText(text => text
                .setPlaceholder(DEFAULT_SETTINGS.propertyProtein.toString())
                .setValue(this.plugin.settings.propertyProtein.toString())
                .onChange(async (value) => {
                    value = value.trim();
                    if (value == "") {
                        value = DEFAULT_SETTINGS.propertyProtein
                    }
                    this.plugin.settings.propertyProtein = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Property for fat')
            .setDesc('Property of products folder files that contains number of fat.')
            .addText(text => text
                .setPlaceholder(DEFAULT_SETTINGS.propertyFat.toString())
                .setValue(this.plugin.settings.propertyFat.toString())
                .onChange(async (value) => {
                    value = value.trim();
                    if (value == "") {
                        value = DEFAULT_SETTINGS.propertyFat
                    }
                    this.plugin.settings.propertyFat = value;
                    await this.plugin.saveSettings();
                }));                
                
        new Setting(containerEl)
            .setName('Property for carbs')
                .setDesc('Property of products folder files that contains number of carbohydrates.')
                .addText(text => text
                    .setPlaceholder(DEFAULT_SETTINGS.propertyCarbs.toString())
                    .setValue(this.plugin.settings.propertyCarbs.toString())
                    .onChange(async (value) => {
                        value = value.trim();
                        if (value == "") {
                            value = DEFAULT_SETTINGS.propertyCarbs
                        }
                        this.plugin.settings.propertyCarbs = value;
                        await this.plugin.saveSettings();
                    })); 

	}
}