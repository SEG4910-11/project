/*
UseCase: Add Option
Pre UseCases: EditForm

Procedure:

•The user enters a new option in the text field 
•The user lose focus on the field
•The system adds the option to the menu
•The system displays the new option at the bottom of the menu
•The system displays a new empty text field at the bottom
Post Conditions: SaveEdit, CancelEdit

*/
describe('add option', function()
{
	it('should be logged in as an admin');
	it('form should be in edit mode');
	it('should wait for user to click plus sign to add new option');
	it('should not allow empty text field to be added');
	it('should display new option at bottom of menu');
	it('should dispaly new empty text field at bottom');
}
);