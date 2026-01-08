cmake_minimum_required(VERSION 3.15)

project(uec-evse VERSION 0.1.0 DESCRIPTION "UEC EVSE diagnostic components" LANGUAGES CXX)

set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

add_compile_definitions(
    RAPIDJSON_HAS_STDSTRING=1
    OPENTELEMETRY_ABI_VERSION_NO=2)

find_package(RapidJSON REQUIRED)
find_package(opentelemetry-cpp REQUIRED)

include_directories(${CMAKE_CURRENT_SOURCE_DIR}/include)

add_library(uec-telemetry STATIC
    src/telemetry/control_pilot.cpp
)

add_executable(uec-evse
    src/everest.cpp
    src/main.cpp)
target_link_libraries(uec-evse uec-telemetry)
