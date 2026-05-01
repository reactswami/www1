# alerting-libraries

This project is used to export the tinymce package which we use in the `nim-alerting.js` file.

It builds two javascript files and places them underneath the tinymce folder in the `js` directory:

-  `main.js` - this is the built version of the `tinymce.js`` file underneath the app directory

-  `tinymce.js` - this is the tinymce package

Other dependencies include the custom skin that we have built for tinymce which can be found underneath `css/tinymce/`

Instructions on how to generate a new skin can be found [here](https://www.tiny.cloud/docs/advanced/creating-a-skin/)

The only modifications we have made is setting the following two lines:

```less
@font-size-base: 12px;
@font-stack: var(--font-family);

@border-color: silver;

.tox-tinymce {
  border: 1px solid @tinymce-border-color;
  border-radius: 0;
  margin: 2px;
}
```
