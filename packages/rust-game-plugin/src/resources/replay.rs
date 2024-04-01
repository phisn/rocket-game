use bevy::ecs::{event::Event, system::Resource};
use serde::{Deserialize, Serialize};

pub struct Replay;

#[derive(Resource, Event, Clone, Copy, Serialize, Deserialize, Default)]
#[wasm_bindgen]
pub struct FrameInput {
    pub rotation: f32,
    pub thrust: bool,
}
