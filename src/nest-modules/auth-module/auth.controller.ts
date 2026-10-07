import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // isso foi usado para testar a autenticação, mas agora é usado o keycloak
  @Post()
  login(@Body() body) {
    return this.authService.login(body.email, body.password);
  }

  @UseGuards(AuthGuard)
  @Get()
  protected() {
    return { name: 'ok' };
  }
}