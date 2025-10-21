pub const ONE_KILO_BYTE: usize = 1024;

pub const MAX_CONTENT_LENGTH: usize = 50 * ONE_KILO_BYTE;
pub const MAX_FORM_DATA_LENGTH: usize = 10 * ONE_KILO_BYTE;

pub const WINDOW_LIMIT_MINS: u64 = 60; // 1 hour = 60 min
pub const CORS_CONFIG_MAX_AGE: u32 = 86400;
pub const CORS_CONFIG_MIN_AGE: u32 = CORS_CONFIG_MAX_AGE / 24;
pub const MAX_REQUEST_LINE_SIZE: usize = 8192;
pub const MAX_HEADER_LINE_SIZE: usize = 8192;

pub const RFC_5321_MAX_EMAIL_LENGTH: usize = 254;
pub const RFC_5321_MAX_LOCAL_PART_LENGTH: usize = 64;
pub const RFC_5321_MAX_DOMAIN_PART_LENGTH: usize = 253;

pub struct FieldConstraint {
    pub name: &'static str,
    pub max_length: usize,
    pub required: bool,
    pub email: bool, // true for email field, enables regex validation
}

pub const FIELD_CONSTRAINTS: &[FieldConstraint] = &[
    FieldConstraint {
        name: "name",
        max_length: 40,
        required: true,
        email: false,
    },
    FieldConstraint {
        name: "email",
        max_length: 80,
        required: true,
        email: true,
    },
    FieldConstraint {
        name: "message",
        max_length: 2000,
        required: true,
        email: false,
    },
    FieldConstraint {
        name: "frontend",
        max_length: 10,
        required: false,
        email: false,
    },
    FieldConstraint {
        name: "webDevelopment",
        max_length: 10,
        required: false,
        email: false,
    },
    FieldConstraint {
        name: "blender",
        max_length: 10,
        required: false,
        email: false,
    },
];

pub const OPTIONAL_CHECKBOX: [&str; 3] = ["blender", "frontend", "webDevelopment"];
