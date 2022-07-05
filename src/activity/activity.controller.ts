import { Controller, Get, HttpStatus, Req, Res } from '@nestjs/common';

import { IActivity } from './activity.interface';
import { ActivityService } from './activity.service';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get('/')
  async getActivities(@Req() request, @Res() response): Promise<IActivity[]> {
    try {
      return response.status(HttpStatus.OK).json([
        { action: 'wallet created', createdAt: '05/06/2022' },
        { action: 'funds transferred', createdAt: '05/06/2022' },
        { action: 'Nft purchased', createdAt: '05/06/2022' },
      ]);
    } catch (error) {
      if (!error.status)
        return response.status(500).json({ message: error.message });

      return response.status(error.status).json(error.response);
    }
  }
}
