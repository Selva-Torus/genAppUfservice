import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne,OneToOne, JoinColumn } from 'typeorm';




@Entity({ name: "usetable",schema: "TT407_TG4CGFA"})
export class  usetableEntity{

    @ApiProperty({example:"number"})
    @PrimaryGeneratedColumn({ name: "id" })
    id:number;

    @ApiProperty({example:"string"})
    @Column({ 
      name: "name", 
      type: "varchar2",
      nullable:true, 
      unique:false,
    })
    name:string;

    @ApiProperty({example:"number"})
    @Column({ 
      name: "age", 
      type: "number",
      nullable:true, 
      unique:false,
    })
    age:number;

    @ApiProperty({example:"string"})
    @Column({ 
      name: "address", 
      type: "varchar2",
      nullable:true, 
      unique:false,
    })
    address:string;

    @ApiProperty({example:"string"})
    @Column({ 
      name: "phone", 
      type: "varchar2",
      nullable:true, 
      unique:false,
default: 123123,    })
    phone:string;


    @ApiProperty({example:"string"})
    @Column({ name: "trs_creator_email", nullable: true, type: "varchar2" })
    trs_creator_email: string;

    @Transform(({ value }) => value?.toISOString())
    @ApiProperty({example:"datetime"})
    @CreateDateColumn({ name: "trs_created_date", type: "timestamp" })
    trs_created_date: Date;

    @ApiProperty({example:"string"})
    @Column({ name: "trs_created_by", nullable: true, type: "varchar2" })
    trs_created_by: string;

    @Transform(({ value }) => value?.toISOString())
    @ApiProperty({example:"datetime"})
    @UpdateDateColumn({ name: "trs_modified_date", type: "timestamp" })
    trs_modified_date: Date;

    @ApiProperty({example:"string"})
    @Column({ name: "trs_modified_by", nullable: true, type: "varchar2" })
    trs_modified_by: string;

    @ApiProperty({example:"string"})
    @Column({ name: "trs_status", nullable: true, type: "varchar2" })
    trs_status: string;

    @ApiProperty({example:"string"})
    @Column({ name: "trs_next_status", nullable: true, type: "varchar2" })
    trs_next_status: string;

    @ApiProperty({example:"string"})
    @Column({ name: "trs_process_id", nullable: true, type: "varchar2" })
    trs_process_id: string;

    @ApiProperty({example:"string"})
    @Column({ name: "trs_access_profile", nullable: true, type: "varchar2" })
    trs_access_profile: string;

    @ApiProperty({example:"string"})
    @Column({ name: "trs_org_grp_code", nullable: true, type: "varchar2" })
    trs_org_grp_code: string;

    @ApiProperty({example:"string"})
    @Column({ name: "trs_org_code", nullable: true, type: "varchar2" })
    trs_org_code: string;
    
    @ApiProperty({example:"string"})
    @Column({ name: "trs_role_grp_code", nullable: true, type: "varchar2" })
    trs_role_grp_code: string;

    @ApiProperty({example:"string"})
    @Column({ name: "trs_role_code", nullable: true, type: "varchar2" })
    trs_role_code: string;

    @ApiProperty({example:"string"})
    @Column({ name: "trs_ps_grp_code", nullable: true, type: "varchar2" })
    trs_ps_grp_code: string;

    @ApiProperty({example:"string"})
    @Column({ name: "trs_ps_code", nullable: true, type: "varchar2" })
    trs_ps_code: string;
}




export class  usetable_OnlyParentEntity{

    @ApiProperty({example:"number"})
    @PrimaryGeneratedColumn({ name: "id" })
    id:number;

    @ApiProperty({example:"string"})
    @Column({ 
      name: "name", 
      type: "varchar2",
      nullable:true, 
      unique:false,
    })
    name:string;

    @ApiProperty({example:"number"})
    @Column({ 
      name: "age", 
      type: "number",
      nullable:true, 
      unique:false,
    })
    age:number;

    @ApiProperty({example:"string"})
    @Column({ 
      name: "address", 
      type: "varchar2",
      nullable:true, 
      unique:false,
    })
    address:string;

    @ApiProperty({example:"string"})
    @Column({ 
      name: "phone", 
      type: "varchar2",
      nullable:true, 
      unique:false,
default: 123123,    })
    phone:string;

    @ApiProperty({example:"string"})
    @Column({ name: "trs_creator_email", nullable: true, type: "varchar2" })
    trs_creator_email: string;

    @Transform(({ value }) => value?.toISOString())
    @ApiProperty({example:"datetime"})
    @CreateDateColumn({ name: "trs_created_date", type: "timestamp" })
    trs_created_date: Date;

    @ApiProperty({example:"string"})
    @Column({ name: "trs_created_by", nullable: true, type: "varchar2" })
    trs_created_by: string;

    @Transform(({ value }) => value?.toISOString())
    @ApiProperty({example:"datetime"})
    @UpdateDateColumn({ name: "trs_modified_date", type: "timestamp" })
    trs_modified_date: Date;

    @ApiProperty({example:"string"})
    @Column({ name: "trs_modified_by", nullable: true, type: "varchar2" })
    trs_modified_by: string;

    @ApiProperty({example:"string"})
    @Column({ name: "trs_status", nullable: true, type: "varchar2" })
    trs_status: string;

    @ApiProperty({example:"string"})
    @Column({ name: "trs_next_status", nullable: true, type: "varchar2" })
    trs_next_status: string;

    @ApiProperty({example:"string"})
    @Column({ name: "trs_process_id", nullable: true, type: "varchar2" })
    trs_process_id: string;

    @ApiProperty({example:"string"})
    @Column({ name: "trs_access_profile", nullable: true, type: "varchar2" })
    trs_access_profile: string;

    @ApiProperty({example:"string"})
    @Column({ name: "trs_org_grp_code", nullable: true, type: "varchar2" })
    trs_org_grp_code: string;

    @ApiProperty({example:"string"})
    @Column({ name: "trs_org_code", nullable: true, type: "varchar2" })
    trs_org_code: string;
    
    @ApiProperty({example:"string"})
    @Column({ name: "trs_role_grp_code", nullable: true, type: "varchar2" })
    trs_role_grp_code: string;

    @ApiProperty({example:"string"})
    @Column({ name: "trs_role_code", nullable: true, type: "varchar2" })
    trs_role_code: string;

    @ApiProperty({example:"string"})
    @Column({ name: "trs_ps_grp_code", nullable: true, type: "varchar2" })
    trs_ps_grp_code: string;

    @ApiProperty({example:"string"})
    @Column({ name: "trs_ps_code", nullable: true, type: "varchar2" })
    trs_ps_code: string;
}