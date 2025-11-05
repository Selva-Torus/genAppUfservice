import { DataSource } from 'typeorm';
import { usetableEntity } from './usetable/entity/usetable.entity';   

export const AppDataSource = new DataSource({
    type: 'oracle',
    host: '192.168.2.177',
    port: 1521,
    username: 'TT407_TG4CGFA',
    password: 'Gsstpl100',
    serviceName: 'xe',         
    entities: [usetableEntity],  
    migrations: ['src/erd/migrations/*.ts'],
    synchronize: false,
});







