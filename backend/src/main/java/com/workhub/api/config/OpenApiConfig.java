package com.workhub.api.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    private static final String SECURITY_SCHEME_NAME = "cookieAuth";

    @Bean
    public OpenAPI workHubOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("WorkHub API")
                        .description("Tài liệu OpenAPI cho nền tảng kết nối người làm tự do và bên thuê dịch vụ.")
                        .version("v1.0.0")
                        .license(new License().name("Apache 2.0")))
                .components(new Components()
                        .addSecuritySchemes(SECURITY_SCHEME_NAME,
                                new SecurityScheme()
                                        .name(SECURITY_SCHEME_NAME)
                                        .type(SecurityScheme.Type.APIKEY)
                                        .in(SecurityScheme.In.COOKIE)
                                        .description("JWT lưu trong HTTP-only cookie, tên cookie do backend cấu hình.")
                        )
                )
                .addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME_NAME));
    }
}

