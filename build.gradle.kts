import java.util.Date
import org.gradle.api.JavaVersion
import org.gradle.api.file.DuplicatesStrategy
import org.gradle.api.tasks.Copy
import org.gradle.api.tasks.bundling.Jar
import org.gradle.api.tasks.bundling.Zip
import org.gradle.api.tasks.compile.JavaCompile
import org.gradle.api.tasks.wrapper.Wrapper

plugins {
    java
    id("edu.sc.seis.launch4j") version "4.0.0"
}

group = "groovejames"
version = "42"

val javaRelease = JavaVersion.VERSION_17.majorVersion.toInt()

tasks.named<JavaCompile>("compileJava") {
    options.encoding = "utf-8"
    options.compilerArgs.add("-Xlint:unchecked,deprecation")
    options.release = javaRelease
}

tasks.named<JavaCompile>("compileTestJava") {
    options.encoding = "utf-8"
    options.compilerArgs.add("-Xlint:unchecked,deprecation")
    options.release = javaRelease
}

java {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.slf4j:slf4j-api:1.7.20")
    implementation("com.google.guava:guava:18.0")
    implementation("org.apache.httpcomponents:httpclient:4.3.6") {
        exclude(group = "commons-logging", module = "commons-logging")
    }
    implementation("org.blinkenlights.jid3:JID3:0.46")
    implementation("org.apache.pivot:pivot-core:2.0.5")
    implementation("org.apache.pivot:pivot-wtk:2.0.5")
    implementation("org.apache.pivot:pivot-wtk-terra:2.0.5")
    implementation("com.mashape.unirest:unirest-java:1.4.7") {
        exclude(group = "commons-logging", module = "commons-logging")
    }
    implementation("com.fasterxml.jackson.core:jackson-databind:2.6.2")
    implementation("com.github.tulskiy:jkeymaster:1.2")
    runtimeOnly("org.slf4j:jcl-over-slf4j:1.7.13")
    runtimeOnly("ch.qos.logback:logback-classic:1.1.8")
    testImplementation("junit:junit:4.12")
}

val updateVersionProperties by tasks.registering {
    doLast {
        file("src/main/resources/groovejames/gui/build.properties")
            .writeText("build.number=$version\nbuild.date=${Date()}")
    }
}

val distDir = layout.buildDirectory.dir("dist")
val distBinDir = layout.buildDirectory.dir("dist/bin")
val jarTask = tasks.named<Jar>("jar")
val cleanTask = tasks.named("clean")
val buildTask = tasks.named("build")
val createExeTask = tasks.named("createExe")

tasks.named("compileJava") {
    dependsOn(updateVersionProperties)
}

jarTask.configure {
    // Build uber-jar containing all runtime dependencies.
    dependsOn(updateVersionProperties)
    duplicatesStrategy = DuplicatesStrategy.EXCLUDE
    from(configurations.runtimeClasspath.get().map { if (it.isDirectory) it else zipTree(it) })
    manifest {
        attributes(
            mapOf(
                "Main-Class" to "groovejames.gui.Main",
                "Build-Number" to version.toString(),
                "Build-Date" to Date()
            )
        )
    }
}

val distBinPrepare by tasks.registering(Copy::class) {
    dependsOn(jarTask)
    from("CHANGES.md", "grooveJames.exe", "etc/grooveJames.desktop")
    from("src/main/resources/groovejames/gui/images/butler-128.png")
    from(layout.buildDirectory.dir("libs")) {
        include("groovejames-*.jar")
    }
    into(distBinDir)
    rename("groovejames-.+\\.jar", "grooveJames.jar")
    rename("butler-128.png", "grooveJames.png")
}

val distBin by tasks.registering(Zip::class) {
    dependsOn(distBinPrepare)
    from(distBinDir)
    include("*")
    destinationDirectory = distDir
    archiveFileName = "grooveJames-r$version-bin.zip"
}

val distSrc by tasks.registering(Zip::class) {
    from(".") {
        exclude("out", "build", "classes", ".gradle", ".idea")
        exclude("**/.svn/**", "**/*.log", "**/*.log.*", "**/Thumbs.db")
        exclude("**/.project", "**/.classpath", "**/.settings")
        exclude("**/*.ipr", "**/*.iml", "**/*.iws")
    }
    destinationDirectory = distDir
    archiveFileName = "grooveJames-r$version-src.zip"
    into("grooveJames")
}

tasks.withType<edu.sc.seis.launch4j.tasks.DefaultLaunch4jTask>().configureEach {
    dependsOn(jarTask)
    outfile = "grooveJames.exe"
    mainClassName = "groovejames.gui.Main"
    icon = "${projectDir}/butler.ico"
    dontWrapJar = true
    chdir = "."
    headerType = "gui"
    errTitle = "GrooveJames - Error"
    priority = "normal"
    downloadUrl = "https://www.oracle.com/de/java/technologies/downloads/"
    supportUrl = "https://github.com/groovejames/groovejames"
    stayAlive = false
    mutexName = "grooveJames"
    windowTitle = "GrooveJames"
    jreMinVersion = "$javaRelease.0.0"
    maxHeapPercent = 80
    jvmOptions = setOf("-Djna.nosys=true")
    fileDescription = "GrooveJames - ripping tracks from music.163.com"
    copyright = "The GrooveJames developers"
    productName = "GrooveJames"
    internalName = "GrooveJames"
    textVersion = "1.0"
    version = "1.0.0.0"
    messagesStartupError = "An error occurred while starting the application."
    messagesJreVersionError =
            "Cannot find a suitable Java Runtime Environment.\\n" +
            "GrooveJames requires Java 17 or higher.\\n\\n" +
            "Your browser will now point you to a website\\n" +
            "where you can download the latest Java version.\\n\\n" +
            "Note: GrooveJames requires at least Java version"
    messagesLauncherError =
        "The registry refers to a nonexistent Java Runtime Environment installation or the runtime is corrupted."
    messagesInstanceAlreadyExists = "GrooveJames is already running."
}

tasks.register("updateExe") {
    dependsOn(createExeTask)
    doLast {
        val generatedExe = layout.buildDirectory.file("launch4j/grooveJames.exe").get().asFile
        generatedExe.copyTo(file("grooveJames.exe"), overwrite = true)
    }
}

tasks.register("distAll") {
    dependsOn(cleanTask, buildTask, distBin, distSrc)
}

buildTask.configure {
    mustRunAfter(cleanTask)
}

tasks.named<Wrapper>("wrapper") {
    gradleVersion = "9.4.0"
    distributionType = Wrapper.DistributionType.ALL
}
