FROM maven:3.8.5-openjdk-17-slim
WORKDIR /app
COPY make-my-trip-clone-springboot-main/ .
RUN chmod +x mvnw && ./mvnw clean install -DskipTests
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "target/makemytrip-0.0.1-SNAPSHOT.jar"]