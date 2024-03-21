# Foodiary 🍅 🍒 🍊

It is a plugin for [Obsidian](https://obsidian.md) designed to help you monitor the nutritional value of food you eat.

## 🙂 How to use it?

### Create products folder

First of all, you should specify the "Product folder" setting in plugin's settings. It refers to a folder in your fault supposed to contain nutrition data for the food you eat.  

Here is [an example](sample/Products) of the folder in the [sample vault](sample). Please note:

1. Each file refers to a product. The name of it is how you are going to refer it in your notes.
3. Each file has four properties: `calories`, `protein`, `fat` and `carbs`. All of them supposed to contain nutritional values for the represented product and must be indicated per 100 grams.

Please note that you can rename the properties in the plugin's settings.

### Use code block in daily notes

You make daily notes, I guess. So, every day, you add a `foodiary` code block to enlist food you eat. You can do it manually or via the "Insert food diary" command.

Here is [an example](sample/Daily%20Notes) in the [sample vault](sample).

For instance, you add this:

````
```foodiary
Apples 100
Donuts 100
```
````

And you get this:

| Product | Calories | Protein | Fat | Carbs |
| ------- | -------- | ------- | --- | ----- |
| Donuts  | 296      | 6       | 13  | 39    |
| Apples  | 47       | 1       | 1   | 10    |
| TOTAL   | 343      | 7       | 14  | 49    |

So the plugin takes the food you refer to in code block, finds it in products catalog and shows total nutrition for each product you have consumed during the day.