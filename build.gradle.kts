import org.gradle.kotlin.dsl.*
import java.util.Date

plugins {
    java
}

group = "groovejames"
version = "35"

java {
    sourceCompatibility = JavaVersion.VERSION_1_7
    targetCompatibility = JavaVersion.VERSION_1_7
}

tasks.withType<JavaCompile> {
    options.encoding = "UTF-8"
    options.compilerArgs.addAll(arrayOf("-Xlint:unchecked", "-Xlint:deprecation"))
}

repositories { mavenCentral() }

dependencies {
    compile("org.slf4j:slf4j-api:1.7.20")
    compile("com.google.guava:guava:18.0")
    compile("org.apache.httpcomponents:httpclient:4.3.6") {
        exclude(group = "commons-logging", module = "commons-logging")
    }
    compile("org.blinkenlights.jid3:JID3:0.46")
    compile("org.apache.pivot:pivot-core:2.0.5")
    compile("org.apache.pivot:pivot-wtk:2.0.5")
    compile("org.apache.pivot:pivot-wtk-terra:2.0.5")
    compile("com.mashape.unirest:unirest-java:1.4.7") {
        exclude(group = "commons-logging", module = "commons-logging")
    }
    compile("com.fasterxml.jackson.core:jackson-databind:2.6.2")
    compile("com.github.tulskiy:jkeymaster:1.2")
    runtime("org.slf4j:jcl-over-slf4j:1.7.13")
    runtime("ch.qos.logback:logback-classic:1.1.8")
    testCompile("junit:junit:4.12")
}


tasks {
    val updateVersionPropertiesTask = "updateVersionProperties" {
        dependsOn("compileJava")
        File("src/main/resources/groovejames/gui/build.properties").bufferedWriter().use { w ->
            w.write("build.number=$version\nbuild.date=${Date()}\n")
        }
    }

    val jarTask = "jar"(Jar::class) {
        dependsOn(updateVersionPropertiesTask)
        // build uber-jar containing all other jars
        from(configurations.runtime.map { f -> if (f.isDirectory) f else zipTree(f) })
        manifest {
            attributes(hashMapOf(
                    "Main-Class" to "groovejames.gui.Main",
                    "Build-Number" to version,
                    "Build-Date" to Date(),
                    "SplashScreen-Image" to "groovejames/gui/images/butler-128.png"
            ))
        }
    }

    val distBinPrepareTask = "distBinPrepare"(Copy::class) {
        dependsOn(jarTask)
        from("CHANGES.md", "grooveJames.exe", "etc/grooveJames.desktop")
        from("src/main/resources/groovejames/gui/images/butler-128.png")
        from("$buildDir/libs/") {
            include("groovejames-*.jar")
        }
        into("$buildDir/dist/bin/")
        rename("groovejames-.+\\.jar", "grooveJames.jar")
        rename("butler-128.png", "grooveJames.png")
    }

    val distBinTask = "distBin"(Zip::class) {
        dependsOn(distBinPrepareTask)
        from("$buildDir/dist/bin/")
        include("*")
        destinationDir = File("$buildDir/dist")
        archiveName = "grooveJames-r$version-bin.zip"
    }

    val distSrcTask = "distSrc"(Zip::class) {
        from(".") {
            exclude("out", "build", "classes", ".gradle", ".idea")
            exclude("**/.svn/**", "**/*.log", "**/*.log.*", "**/Thumbs.db")
            exclude("**/.project", "**/.classpath", "**/.settings")
            exclude("**/*.ipr", "**/*.iml", "**/*.iws")
        }
        destinationDir = File("$buildDir/dist")
        archiveName = "grooveJames-r$version-src.zip"
        into("grooveJames")
    }

    "distAll" {
        dependsOn("clean", "build", distBinTask, distSrcTask)
    }

    tasks["build"].mustRunAfter("clean")


    "updateExe" {
        doLast {
            val launch4jDir by project
            if (launch4jDir == null || !file(launch4jDir).exists()) {
                throw GradleException("Cannot create exe because Launch4j not found. Use -Plaunch4jDir=<dir> to set the Launch4j installation directory or add file gradle.properties with \"launch4jDir=<dir>\"")
            }
            ant.withGroovyBuilder {
                "taskdef"("name" to "launch4j", "classname" to "net.sf.launch4j.ant.Launch4jTask", "classpath" to "$launch4jDir/launch4j.jar")
                "launch4j"("configFile" to "launch4j.xml")
            }
        }
    }


    "wrapper"(Wrapper::class) {
        gradleVersion = "4.6"
        distributionType = Wrapper.DistributionType.ALL
    }
}
