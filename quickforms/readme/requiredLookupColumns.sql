use [insert-app-name-here];

create table lkup_exampleLookup
	(exampleLookupKey int primary key not null,
	exampleLookupLabel varchar(100),
	exampleLookupOrder int not null default (0) -- can't be null
	-- put extra columns here
	);
