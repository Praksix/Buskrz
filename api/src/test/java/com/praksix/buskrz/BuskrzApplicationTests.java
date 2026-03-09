package com.praksix.buskrz;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@ActiveProfiles("test")
class BuskrzApplicationTests {

    @MockBean
    private org.springframework.data.mongodb.gridfs.GridFsTemplate gridFsTemplate;

    @Test
    void contextLoads() {
    }

}
