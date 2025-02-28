// File: /Users/max/Desktop/study_bot/study_bot/app/page.tsx
import * as entry from '../../../app/page.js';
// Check that the entry is a valid entry
checkFields();
// Check the prop type of the entry function
checkFields();
// Check the arguments and return type of the generateMetadata function
if ('generateMetadata' in entry) {
  checkFields();
  checkFields();
}
// Check the arguments and return type of the generateViewport function
if ('generateViewport' in entry) {
  checkFields();
  checkFields();
}
// Check the arguments and return type of the generateStaticParams function
if ('generateStaticParams' in entry) {
  checkFields();
  checkFields();
}
function checkFields() {}
