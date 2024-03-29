use bevy::{ecs::schedule::SystemConfigs, prelude::*};

pub mod common;
pub mod level;
pub mod rocket;
pub mod shape;

pub fn systems() -> SystemConfigs {
    (common::systems(), level::systems(), rocket::systems())
        .chain()
        .into_configs()
}

pub fn startup() -> SystemConfigs {
    (rocket::startup, shape::startup, level::startup)
        .chain()
        .into_configs()
}
