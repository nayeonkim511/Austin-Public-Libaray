#include <stdlib.h>
#include <stdio.h>
#include <time.h>
#include "parson.h"

int convert(const char *filename) {
    // Open the input JSON file for reading
    FILE *input_file = fopen(filename, "r");
    if (input_file == NULL) {
        fprintf(stderr, "Failed to open the input JSON file for reading.\n");
        return 1;
    }

    // Parse the input JSON data into an array
    JSON_Value *input_root = json_parse_file(filename);
    
    if (input_root == NULL) {
        fprintf(stderr, "Failed to parse the input JSON data.\n");
        fclose(input_file);
        return 1;
    }

    // Access the input JSON array
    JSON_Array *input_array = json_object_dotget_array(input_root, "apl_event");
    if (input_array == NULL) {
        fprintf(stderr, "Root element in the input file is not an array.\n");
        fclose(input_file);
        json_value_free(input_root);
        return 1;
    }

    // Create a new JSON array to store the modified data
    JSON_Value *output_root = json_value_init_array();
    JSON_Array *output_array = json_value_get_array(output_root);
    JSON_Value *output_object = json_value_init_object();

    // Modify each element in the input JSON array and add it to the output array
    for (size_t i = 0; i < json_array_get_count(input_array); i++) {
        JSON_Object *input_object = json_array_get_object(input_array, i);
        if (input_object != NULL) {
            // Modify the JSON object as needed
            if(json_object_get_string(input_object, "nid")) {
                json_object_set_string(output_object, "id", json_object_get_string(input_object, "nid"));
            }
            if(json_object_get_string(input_object, "title")) {
                json_object_set_string(output_object, "title", json_object_get_string(input_object, "title"));
            }
            if(json_object_get_string(input_object, "field_slr_time_start")) {
                json_object_set_string(output_object, "start", convertToJSDate((long long)json_object_get_string(input_object, "field_slr_time_start")));
            }
            if(json_object_get_string(input_object, "field_slr_time_end")) {
                json_object_set_string(output_object, "end", convertToJSDate((long long)json_object_get_string(input_object, "field_slr_time_end")));
            }
            if(json_object_get_string(input_object, "field_slr_time_start") && json_object_get_string(input_object, "field_slr_time_end")) {
                long long startsec = (long long) json_object_get_string(input_object, "field_slr_time_start");
                long long endsec = (long long) json_object_get_string(input_object, "field_slr_time_end");
                if(endsec - startsec >= 86400) {
                    json_object_set_boolean(output_object, "allDay", 1);
                } else {
                    json_object_set_boolean(output_object, "allDay", 0);
                }
            }
            json_array_append_value(output_array, output_object);
        }
    }

    // Close the input file and free the input JSON data
    fclose(input_file);
    json_value_free(input_root);

    // Open the output JSON file for writing
    FILE *output_file = fopen("output.json", "w");
    if (output_file == NULL) {
        fprintf(stderr, "Failed to open the output JSON file for writing.\n");
        json_value_free(output_root);
        return 1;
    }

    // Serialize the modified JSON data and write it to the output file
    char *serialized_json = json_serialize_to_string_pretty(output_root);
    if (serialized_json == NULL) {
        fprintf(stderr, "Failed to serialize the JSON data.\n");
        fclose(output_file);
        json_value_free(output_root);
        return 1;
    }

    // Write the serialized JSON to the output file
    fwrite(serialized_json, 1, strlen(serialized_json), output_file);

    // Close the output file and free the serialized JSON string
    fclose(output_file);
    json_free_serialized_string(serialized_json);
    json_value_free(output_root);

    printf("Modified JSON array has been saved to output.json.\n");

    return 0;
}

char* convertToJSDate(long long seconds) {
    time_t unixTime = (time_t)seconds;
    struct tm* timeInfo;
    char buffer[50];

    timeInfo = gmtime(&unixTime);

    strftime(buffer, sizeof(buffer), "%a %b %d %Y %H:%M:%S GMT", timeInfo);

    return buffer;
}

