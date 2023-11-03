/** Load Dependency Source Graphs */

import '@brentbahry/reflection';
import '@proteinjs/db';
import 'knex';
import 'moment';
import 'mysql';
import 'uuid';


/** Generate Source Graph */

const sourceGraph = "{\"options\":{\"directed\":true,\"multigraph\":false,\"compound\":false},\"nodes\":[{\"v\":\"@proteinjs/db-driver/MysqlConfig\",\"value\":{\"packageName\":\"@proteinjs/db-driver\",\"name\":\"MysqlConfig\",\"filePath\":\"/Users/brentbahry/repos/components/db/driver/src/MysqlConfig.ts\",\"qualifiedName\":\"@proteinjs/db-driver/MysqlConfig\",\"typeParameters\":[],\"directParents\":[{\"packageName\":\"@brentbahry/reflection\",\"name\":\"Loadable\",\"filePath\":null,\"qualifiedName\":\"@brentbahry/reflection/Loadable\",\"typeParameters\":[],\"directParents\":null},{\"packageName\":\"@proteinjs/db-driver\",\"name\":\"{\\n  host?: string,\\n  user?: string,\\n  password?: string,\\n  dbName?: string,\\n}\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/db-driver/{\\n  host?: string,\\n  user?: string,\\n  password?: string,\\n  dbName?: string,\\n}\",\"typeParameters\":[],\"directParents\":null}],\"sourceType\":1}},{\"v\":\"@brentbahry/reflection/Loadable\"},{\"v\":\"@proteinjs/db-driver/MysqlDriver\",\"value\":{\"packageName\":\"@proteinjs/db-driver\",\"name\":\"MysqlDriver\",\"filePath\":\"/Users/brentbahry/repos/components/db/driver/src/MysqlDriver.ts\",\"qualifiedName\":\"@proteinjs/db-driver/MysqlDriver\",\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\",\"properties\":[{\"name\":\"CONFIG\",\"type\":{\"packageName\":\"\",\"name\":\"any\",\"filePath\":null,\"qualifiedName\":\"/any\",\"typeParameters\":null,\"directParents\":null},\"isOptional\":false,\"isAbstract\":false,\"isStatic\":true,\"visibility\":\"private\"},{\"name\":\"DB_NAME\",\"type\":{\"packageName\":\"\",\"name\":\"string\",\"filePath\":null,\"qualifiedName\":\"/string\",\"typeParameters\":null,\"directParents\":null},\"isOptional\":false,\"isAbstract\":false,\"isStatic\":true,\"visibility\":\"private\"},{\"name\":\"knex\",\"type\":{\"packageName\":\"\",\"name\":\"knex\",\"filePath\":null,\"qualifiedName\":\"/knex\",\"typeParameters\":null,\"directParents\":null},\"isOptional\":false,\"isAbstract\":false,\"isStatic\":true,\"visibility\":\"private\"}],\"methods\":[{\"name\":\"getConfig\",\"returnType\":null,\"isAsync\":false,\"isOptional\":false,\"isAbstract\":false,\"isStatic\":true,\"visibility\":\"private\",\"parameters\":[]},{\"name\":\"getKnex\",\"returnType\":{\"packageName\":\"\",\"name\":\"any\",\"filePath\":null,\"qualifiedName\":\"/any\",\"typeParameters\":null,\"directParents\":null},\"isAsync\":false,\"isOptional\":false,\"isAbstract\":false,\"isStatic\":true,\"visibility\":\"public\",\"parameters\":[]},{\"name\":\"getDbName\",\"returnType\":null,\"isAsync\":false,\"isOptional\":false,\"isAbstract\":false,\"isStatic\":true,\"visibility\":\"public\",\"parameters\":[]},{\"name\":\"select\",\"returnType\":null,\"isAsync\":false,\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"private\",\"parameters\":[{\"name\":\"table\",\"type\":{\"packageName\":\"\",\"name\":\"Table<any>\",\"filePath\":null,\"qualifiedName\":\"/Table<any>\",\"typeParameters\":null,\"directParents\":null}}]},{\"name\":\"init\",\"returnType\":{\"packageName\":\"\",\"name\":\"Promise<void>\",\"filePath\":null,\"qualifiedName\":\"/Promise<void>\",\"typeParameters\":null,\"directParents\":null},\"isAsync\":true,\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\",\"parameters\":[]},{\"name\":\"tableExists\",\"returnType\":{\"packageName\":\"\",\"name\":\"Promise<boolean>\",\"filePath\":null,\"qualifiedName\":\"/Promise<boolean>\",\"typeParameters\":null,\"directParents\":null},\"isAsync\":true,\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\",\"parameters\":[{\"name\":\"table\",\"type\":{\"packageName\":\"\",\"name\":\"Table<T>\",\"filePath\":null,\"qualifiedName\":\"/Table<T>\",\"typeParameters\":null,\"directParents\":null}}]},{\"name\":\"createDatabaseIfNotExists\",\"returnType\":{\"packageName\":\"\",\"name\":\"Promise<void>\",\"filePath\":null,\"qualifiedName\":\"/Promise<void>\",\"typeParameters\":null,\"directParents\":null},\"isAsync\":true,\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"private\",\"parameters\":[{\"name\":\"databaseName\",\"type\":{\"packageName\":\"\",\"name\":\"string\",\"filePath\":null,\"qualifiedName\":\"/string\",\"typeParameters\":null,\"directParents\":null}}]},{\"name\":\"databaseExists\",\"returnType\":{\"packageName\":\"\",\"name\":\"Promise<boolean>\",\"filePath\":null,\"qualifiedName\":\"/Promise<boolean>\",\"typeParameters\":null,\"directParents\":null},\"isAsync\":true,\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"private\",\"parameters\":[{\"name\":\"databaseName\",\"type\":{\"packageName\":\"\",\"name\":\"string\",\"filePath\":null,\"qualifiedName\":\"/string\",\"typeParameters\":null,\"directParents\":null}}]},{\"name\":\"setMaxAllowedPacketSize\",\"returnType\":{\"packageName\":\"\",\"name\":\"Promise<void>\",\"filePath\":null,\"qualifiedName\":\"/Promise<void>\",\"typeParameters\":null,\"directParents\":null},\"isAsync\":true,\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"private\",\"parameters\":[]},{\"name\":\"get\",\"returnType\":{\"packageName\":\"\",\"name\":\"Promise<Row>\",\"filePath\":null,\"qualifiedName\":\"/Promise<Row>\",\"typeParameters\":null,\"directParents\":null},\"isAsync\":true,\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\",\"parameters\":[{\"name\":\"table\",\"type\":{\"packageName\":\"\",\"name\":\"Table<T>\",\"filePath\":null,\"qualifiedName\":\"/Table<T>\",\"typeParameters\":null,\"directParents\":null}},{\"name\":\"query\",\"type\":{\"packageName\":\"@proteinjs/db\",\"name\":\"SerializedQuery\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/db/SerializedQuery\",\"typeParameters\":null,\"directParents\":null}}]},{\"name\":\"insert\",\"returnType\":{\"packageName\":\"\",\"name\":\"Promise<void>\",\"filePath\":null,\"qualifiedName\":\"/Promise<void>\",\"typeParameters\":null,\"directParents\":null},\"isAsync\":true,\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\",\"parameters\":[{\"name\":\"table\",\"type\":{\"packageName\":\"\",\"name\":\"Table<T>\",\"filePath\":null,\"qualifiedName\":\"/Table<T>\",\"typeParameters\":null,\"directParents\":null}},{\"name\":\"row\",\"type\":{\"packageName\":\"@proteinjs/db\",\"name\":\"Row\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/db/Row\",\"typeParameters\":null,\"directParents\":null}}]},{\"name\":\"update\",\"returnType\":{\"packageName\":\"\",\"name\":\"Promise<void>\",\"filePath\":null,\"qualifiedName\":\"/Promise<void>\",\"typeParameters\":null,\"directParents\":null},\"isAsync\":true,\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\",\"parameters\":[{\"name\":\"table\",\"type\":{\"packageName\":\"\",\"name\":\"Table<T>\",\"filePath\":null,\"qualifiedName\":\"/Table<T>\",\"typeParameters\":null,\"directParents\":null}},{\"name\":\"row\",\"type\":{\"packageName\":\"@proteinjs/db\",\"name\":\"Row\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/db/Row\",\"typeParameters\":null,\"directParents\":null}},{\"name\":\"query\",\"type\":{\"packageName\":\"@proteinjs/db\",\"name\":\"SerializedQuery\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/db/SerializedQuery\",\"typeParameters\":null,\"directParents\":null}}]},{\"name\":\"delete\",\"returnType\":{\"packageName\":\"\",\"name\":\"Promise<void>\",\"filePath\":null,\"qualifiedName\":\"/Promise<void>\",\"typeParameters\":null,\"directParents\":null},\"isAsync\":true,\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\",\"parameters\":[{\"name\":\"table\",\"type\":{\"packageName\":\"\",\"name\":\"Table<T>\",\"filePath\":null,\"qualifiedName\":\"/Table<T>\",\"typeParameters\":null,\"directParents\":null}},{\"name\":\"query\",\"type\":{\"packageName\":\"@proteinjs/db\",\"name\":\"SerializedQuery\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/db/SerializedQuery\",\"typeParameters\":null,\"directParents\":null}}]},{\"name\":\"query\",\"returnType\":{\"packageName\":\"\",\"name\":\"Promise<Row[]>\",\"filePath\":null,\"qualifiedName\":\"/Promise<Row[]>\",\"typeParameters\":null,\"directParents\":null},\"isAsync\":true,\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\",\"parameters\":[{\"name\":\"table\",\"type\":{\"packageName\":\"\",\"name\":\"Table<T>\",\"filePath\":null,\"qualifiedName\":\"/Table<T>\",\"typeParameters\":null,\"directParents\":null}},{\"name\":\"query\",\"type\":{\"packageName\":\"@proteinjs/db\",\"name\":\"SerializedQuery\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/db/SerializedQuery\",\"typeParameters\":null,\"directParents\":null}},{\"name\":\"sort\",\"type\":{\"packageName\":\"@proteinjs/db-driver\",\"name\":\"{ column: string, desc?: boolean }[]\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/db-driver/{ column: string, desc?: boolean }[]\",\"typeParameters\":null,\"directParents\":null}},{\"name\":\"window\",\"type\":{\"packageName\":\"@proteinjs/db-driver\",\"name\":\"{ start: number, end: number }\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/db-driver/{ start: number, end: number }\",\"typeParameters\":null,\"directParents\":null}}]},{\"name\":\"where\",\"returnType\":null,\"isAsync\":true,\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"private\",\"parameters\":[{\"name\":\"knexQueryBulder\",\"type\":{\"packageName\":\"\",\"name\":\"any\",\"filePath\":null,\"qualifiedName\":\"/any\",\"typeParameters\":null,\"directParents\":null}},{\"name\":\"query\",\"type\":{\"packageName\":\"@proteinjs/db\",\"name\":\"SerializedQuery\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/db/SerializedQuery\",\"typeParameters\":null,\"directParents\":null}}]},{\"name\":\"queryWithConditions\",\"returnType\":{\"packageName\":\"\",\"name\":\"Promise<Row[]>\",\"filePath\":null,\"qualifiedName\":\"/Promise<Row[]>\",\"typeParameters\":null,\"directParents\":null},\"isAsync\":true,\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"private\",\"parameters\":[{\"name\":\"knexQueryBulder\",\"type\":{\"packageName\":\"\",\"name\":\"any\",\"filePath\":null,\"qualifiedName\":\"/any\",\"typeParameters\":null,\"directParents\":null}},{\"name\":\"queryConditions\",\"type\":{\"packageName\":\"\",\"name\":\"SerializedQueryCondition[]\",\"filePath\":null,\"qualifiedName\":\"/SerializedQueryCondition[]\",\"typeParameters\":null,\"directParents\":null}}]},{\"name\":\"getRowCount\",\"returnType\":{\"packageName\":\"\",\"name\":\"Promise<number>\",\"filePath\":null,\"qualifiedName\":\"/Promise<number>\",\"typeParameters\":null,\"directParents\":null},\"isAsync\":true,\"isOptional\":false,\"isAbstract\":false,\"isStatic\":false,\"visibility\":\"public\",\"parameters\":[{\"name\":\"table\",\"type\":{\"packageName\":\"\",\"name\":\"Table<T>\",\"filePath\":null,\"qualifiedName\":\"/Table<T>\",\"typeParameters\":null,\"directParents\":null}}]}],\"typeParameters\":[],\"directParentInterfaces\":[{\"packageName\":\"@proteinjs/db\",\"name\":\"DbDriver\",\"filePath\":null,\"qualifiedName\":\"@proteinjs/db/DbDriver\",\"properties\":[],\"methods\":[],\"typeParameters\":[],\"directParents\":[]}],\"directParentClasses\":[],\"sourceType\":2}},{\"v\":\"@proteinjs/db/DbDriver\"}],\"edges\":[{\"v\":\"@proteinjs/db-driver/MysqlConfig\",\"w\":\"@brentbahry/reflection/Loadable\",\"value\":\"extends type\"},{\"v\":\"@proteinjs/db-driver/MysqlDriver\",\"w\":\"@proteinjs/db/DbDriver\",\"value\":\"implements interface\"}]}";


/** Generate Source Links */

import { MysqlDriver } from '../src/MysqlDriver';

const sourceLinks = {
	'@proteinjs/db-driver/MysqlDriver': MysqlDriver,
};


/** Load Source Graph and Links */

import { SourceRepository } from '@brentbahry/reflection';
SourceRepository.merge(sourceGraph, sourceLinks);


export * from '../index';