use [insert-app-name-here];

create table fact_exampleFact
	(exampleFactKey int primary key not null identity,
	-- put extra columns here
	createdDate datetime,
	updatedDate datetime,
	addedBy int -- only if app has authentication
	);
