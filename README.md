# Overview

A simple serializer api. Features:
- Recursive serialization (aka recurse and serialize object properties and array elements, applying custom serialization where appropriate)
- Custom serialization you can define for your types
- Custom serialization you can define for third party lib types

**Note:** Depends on [@proteinjs/reflection](https://github.com/proteinjs/reflection) to load your `CustomSerializer` and `ThirdPartyLibCustomSerializer` implementations.

## How to use

### Basic use

1. Install `npm i -s @proteinjs/serializer`
2. Use `Serializer` for recursive serialization
    ```
    import { Serializer } from '@proteinjs/serializer'

    const pedro = {
        name: 'Pedro Pascal',
        born: 'April 2, 1975',
        moviesAndShows: [
            { name: 'The Last of Us' },
            { name: 'Narcos' },
            { name: 'Game of Thrones' },
        ],
    };
    const serializedPedro = Serializer.serialize(pedro); // string
    const deserializedPedro = Serializer.deserialize(serializedPedro); // object
    console.assert(pedro.moviesAndShows[0].name == deserializedPedro.moviesAndShows[0].name && deserializedPedro.moviesAndShows[0].name == 'The Last of Us')
    ```

### Custom serialization for your type

1. Install `npm i -s @proteinjs/serializer`
2. Setup reflection loading for your package - [instructions](https://github.com/proteinjs/reflection)
3. Use `CustomSerializer` to define a serializer for your type
    ```
    import { CustomSerializer } from '@proteinjs/serializer';
    import { Graph } from '@proteinjs/util';
    import { QueryBuilder } from '@proteinjs/db-query';

    type SerializedQueryBuilder = {
        tableName: string,
        graph: Graph,
        idCounter: number,
        rootId: string,
        currentContextIds: string[],
        paginationNodeId?: string,
    }

    export const queryBuilderSerializerId = '@proteinjs/db/QueryBuilderSerializer';

    export class QueryBuilderSerializer implements CustomSerializer {
        id = queryBuilderSerializerId;
        
        serialize(qb: QueryBuilder<any>): SerializedQueryBuilder {
            return { 
            tableName: qb.tableName,
            graph: qb.graph,
            idCounter: qb.idCounter,
            rootId: qb.rootId,
            currentContextIds: qb.currentContextIds,
            paginationNodeId: qb.paginationNodeId,
            };
        }
        
        deserialize(serializedQb: SerializedQueryBuilder): QueryBuilder<any> {
            const qb = new QueryBuilder(serializedQb.tableName);
            qb.graph = serializedQb.graph;
            qb.idCounter = serializedQb.idCounter;
            qb.rootId = serializedQb.rootId;
            qb.currentContextIds = serializedQb.currentContextIds;
            qb.paginationNodeId = serializedQb.paginationNodeId;
            return qb;
        }
    }
    ```
4. Mark your type with the custom serializer id
    ```
    import { queryBuilderSerializerId } from './QueryBuilderSerializer';
    ...

    export class QueryBuilder<T = any> {
        public __serializerId = queryBuilderSerializerId;
        public graph: Graph;
        public idCounter: number = 0;
        ...
    }
    ```
5. Use `Serializer` per usual. Serializer will find and use `QueryBuilderSerializer` via [@proteinjs/reflection](https://github.com/proteinjs/reflection)'s `SourceRepository` api
    ```
    import { Serializer } from '@proteinjs/serializer';
    import { QueryBuilder } from '@proteinjs/db-query';

    const qb = new QueryBuilder('my-table');
    const serializedQb = Serializer.serialize(qb);
    const deserializedQb = Serializer.deserialize(serializedQb);
    ```

### Custom serialization for third party lib type

1. Install `npm i -s @proteinjs/serializer`
2. Setup reflection loading for your package - [instructions](https://github.com/proteinjs/reflection)
3. Use `ThirdPartyLibCustomSerializer` to define a serializer for a third party lib
    ```
    import moment from 'moment';
    import { ThirdPartyLibCustomSerializer } from '../Serializer';

    type SerializedMoment = {
        value: number,
    }

    export class MomentSerializer implements ThirdPartyLibCustomSerializer {
        id = '@proteinjs/serializer/MomentSerializer';
        
        matches(obj: any) {
            return moment.isMoment(obj);
        }

        serialize(m: moment.Moment): SerializedMoment {
            return { value: m.valueOf() };
        }

        deserialize(serializedMoment: SerializedMoment): moment.Moment {
            return moment(serializedMoment.value);
        }
    }
    ```
4. Use `Serializer` per usual. Serializer will find and use `MomentSerializer` via [@proteinjs/reflection](https://github.com/proteinjs/reflection)'s `SourceRepository` api
    ```
    import moment from 'moment';
    import { Serializer } from '@proteinjs/serializer';

    const now = moment();
    const serializedNow = Serializer.serialize(now);
    const deserializedNow = Serializer.deserialize(serializedNow);
    console.assert(moment.isMoment(deserializedNow));
    ```

**Note:** An implementation of `MomentSerializer` is included by default with `@proteinjs/serializer`; no need to define it yourself