/*
UseCase: AddEditButton
Pre UseCases: 

PreCondition: user is logged in as an admin

Procedure:

•The user goes to "settings"
•The user select the forms from a dropdown menu to add edit button
•The system refreshes and greys-out the forms selected. 
•The system stays in the setting page
Post Conditions: none

*/describe('edit form', function()
{
	it('should be logged in as an admin');
	it('should wait for design button to be clicked');
	it('should display form in edit mode');
	it('should add edit controls to form');
}
);