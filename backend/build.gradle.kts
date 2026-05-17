plugins {
    kotlin("jvm")
    kotlin("plugin.spring")
    kotlin("plugin.jpa")
    id("org.springframework.boot")
    id("io.spring.dependency-management")
}

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

kotlin {
    compilerOptions {
        freeCompilerArgs.addAll("-Xjsr305=strict")
    }
}

dependencies {
    // Spring Boot
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-actuator")

    // Auth (OAuth2 / OIDC — used when auth profile is active)
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-oauth2-resource-server")

    // Kotlin
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("org.jetbrains.kotlin:kotlin-reflect")

    // Database
    implementation("org.flywaydb:flyway-core")
    implementation("org.flywaydb:flyway-database-postgresql")
    runtimeOnly("org.postgresql:postgresql")

    // Hypersistence for JSONB support
    implementation("io.hypersistence:hypersistence-utils-hibernate-63:3.9.0")

    // Testing
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.security:spring-security-test")
}

tasks.withType<Test> {
    useJUnitPlatform()
}

// Copy frontend build output into Spring Boot static resources before building the jar
tasks.named("processResources") {
    dependsOn(":backend:copyFrontend")
}

tasks.register<Copy>("copyFrontend") {
    description = "Task to Copy the Frontend code to the API Service"
    val frontendBuildDir = rootProject.file("frontend/dist")
    from(frontendBuildDir)
    into(layout.buildDirectory.dir("resources/main/static"))
    // Only run copy if the frontend has been built
    onlyIf { frontendBuildDir.exists() }
}
