use [replaceWithDatabaseName];

create table sql_queries
(queryKey int primary key not null identity,
queryLabel varchar(100),
query varchar(8000));

insert into sql_queries values('getFactMetadata','select column_name as field,* from information_schema.columns where table_name like ? order by ordinal_position;');