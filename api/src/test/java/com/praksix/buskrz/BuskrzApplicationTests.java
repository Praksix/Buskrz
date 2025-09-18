package com.praksix.buskrz;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@ActiveProfiles("test")
@TestPropertySource(properties = {
    "spring.data.mongodb.uri=mongodb://localhost:27017/buskrz_test",
    "spring.data.mongodb.database=buskrz_test",
    "spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.mongo.MongoAutoConfiguration"
})
class BuskrzApplicationTests {

	@Test
	void contextLoads() {
	}

}
