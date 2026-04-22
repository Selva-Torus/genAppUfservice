import { ApiProperty } from "@nestjs/swagger";

export class start_all_scheduler{   
        
}

export class start_specific_scheduler{
    @ApiProperty()
        id?: string;
}

export class stop_all_scheduler{
   
}

export class stop_specific_scheduler{
    @ApiProperty()
        id?: string;
}