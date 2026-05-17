package com.hobbyheaven.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.web.SecurityFilterChain

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
class SecurityConfig {

    @Value("\${hobbyheaven.auth.enabled:false}")
    private val authEnabled: Boolean = false

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .csrf { it.disable() }
            .cors { } // configured separately via CorsConfig

        if (authEnabled) {
            http
                .authorizeHttpRequests { auth ->
                    auth
                        .requestMatchers("/actuator/health").permitAll()
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        .anyRequest().authenticated()
                }
                .oauth2ResourceServer { oauth2 ->
                    oauth2.jwt { }
                }
        } else {
            // Auth disabled — permit everything (single-user / trusted network mode)
            http.authorizeHttpRequests { auth ->
                auth.anyRequest().permitAll()
            }
        }

        return http.build()
    }
}
