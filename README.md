# Tattoo Search Tool

## DESCRIPTION
An in-house search tool for a small tattoo studio using MySQL, Python, AWS S3, jQuery, JavaScript and Bootstrap. Vector files are uploaded and automatically converted and re-sized properly into PNGs, descriptive tags are manually added to each image to later be used as a search reference. Images are uploaded to AWS S3, and tags and S3 image references are stored in a database. The search tool API searches the database for matching tags and returns any matches. 

## CURRENT STATUS
- Awaiting design for the Font Finder page. Then V1 of the project will be ready for final QA and ready for use. Current uploaded images and tags are for testing and development purposes only, thus duplicates of images may occur. Future version updates are listed below under Pending Improvements/To Dos.

## ASSUMPTIONS
- Upload will only be handled by one person at a time.

## PENDING IMPROVEMENTS/TO DOS
- SQL transactions for multiple user support
- Increased error handling implementation
- Allow for more file formats (adjustments will be needed during automated image handling)
- Multi match search (being able to show result for images that has two specific tags).
- Update front end to ReactJS or other state handling framework for faster loading and cleaner and more readable FE code. 

## QA/TESTING
- No full QA has been done yet, although the product has been briefly tested on iPad, iPhone and Safari 13.1 and Chrome 83.0.4103.106 for Mac. The product is intended to mainly be used on iPad IOS.

## NOTES
- All code is written by me (with one exception for the image brightness calculation that found on the internet). I have had guidance and discussions of architectural structure with my mentor/partner (and help from the internet of course). Any code reviews are also done by my mentor/partner.
