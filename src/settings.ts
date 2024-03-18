import { 
    App,
    PluginSettingTab,
    Setting,
} from 'obsidian';
import Foodiary from './main';

export interface FoodiarySettings {
	productsFolder: string;
    propertyCalories: string;
    propertyProtein: string;
    propertyFat: string;
    propertyCarbs: string;
}

export const DEFAULT_SETTINGS: FoodiarySettings = {
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