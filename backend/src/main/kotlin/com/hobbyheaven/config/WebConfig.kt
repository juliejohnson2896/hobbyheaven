package com.hobbyheaven.config

import org.springframework.context.annotation.Configuration
import org.springframework.core.io.ClassPathResource
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer
import org.springframework.web.servlet.resource.PathResourceResolver

@Configuration
class WebConfig : WebMvcConfigurer {

    override fun addResourceHandlers(registry: ResourceHandlerRegistry) {
        // Serve React static assets
        registry.addResourceHandler("/**")
            .addResourceLocations("classpath:/static/")
            .resourceChain(true)
            .addResolver(PathResourceResolver().apply {
                // SPA fallback: any path not matching a real file → index.html
                setAllowedLocations(ClassPathResource("static/"))
//                setDefaultLocations(ClassPathResource("static/"))
            })
    }
}
