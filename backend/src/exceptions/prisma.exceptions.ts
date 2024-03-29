import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException, HttpStatus, RequestTimeoutException, UnauthorizedException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

@Catch()
export class AllExceptionFilter implements ExceptionFilter {

	catch(exception: any, host: ArgumentsHost) {
		const context = host.switchToHttp();
		const response = context.getResponse();
		const request = context.getRequest();

		if (exception instanceof Prisma.PrismaClientKnownRequestError && exception.code === 'P2002') {
			let target = exception.meta.target;
			response
				.status(HttpStatus.BAD_REQUEST)
				.json({
					statusCode: HttpStatus.BAD_REQUEST,
					path: request.url,
					msg: `${target} already exists`,
				});
		}
		else if (exception instanceof BadRequestException) {

			let obj: any = exception.getResponse()
			response.status(HttpStatus.BAD_REQUEST)
			.json({
				statusCode: HttpStatus.BAD_REQUEST,
				path: request.url,
				msg: obj.message,
			});
		}
		else if (exception instanceof UnauthorizedException) {

			let obj: any = exception.getResponse()
			response.status(HttpStatus.UNAUTHORIZED)
			.json({
				statusCode: HttpStatus.UNAUTHORIZED,
				path: request.url,
				msg: obj.message,
			});
		}
		else if (exception instanceof RequestTimeoutException) {

			let obj: any = exception.getResponse()
			response.status(HttpStatus.REQUEST_TIMEOUT)
			.json({
				statusCode: HttpStatus.REQUEST_TIMEOUT,
				path: request.url,
				msg: 'aaaaahhhhhhhhhhhhh',
			});
		}
	}
}
