# Foodiary 🍅 🍒 🍊

It is a plugin for [Obsidian](https://obsidian.md) designed to help you monitor the nutritional value of the food you eat.

## 🙂 How to use it?

### Create the products folder

First, you should specify the "Product folder" setting in the plugin's settings. It refers to a folder in your vault that is supposed to contain nutrition data for the food you eat.  

Here is [an example](sample/Products) of the folder in the [sample vault](sample). Please note:

1. Each file refers to a product. The name of it is how you are going to refer it in your notes.
3. Each file has four properties: `calories`, `protein`, `fat` and `carbs`. All of them are supposed to contain nutritional values for the represented product and must be indicated per 100 grams.

Please note that you can rename those properties in the plugin's settings.

### Use code block in daily notes

You make daily notes, I guess. So, every day, you add a `foodiary` code block to enlist the food you eat. You can do it manually or via the "Insert food diary" command.

Here is [an example](sample/Daily%20Notes) in the [sample vault](sample).

For instance, you add this:

````
```foodiary
Apples 150
Donuts 85
```
````

It means you ate 150 grams of apples and 85 grams of donuts. As a result, the code block will show you something like this:

| Product | Calories | Protein | Fat | Carbs |
| ------- | -------- | ------- | --- | ----- |
| Donuts  | 252      | 5       | 12  | 33    |
| Apples  | 71       | 1       | 1   | 15    |
| TOTAL   | 323      | 6       | 13  | 48    |

So the plugin takes the food you refer to in the code block, finds it in the products catalog, and then shows total nutrition for each product you have consumed during the day.