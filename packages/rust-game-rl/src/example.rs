use std::time::{Duration, Instant};

use bevy::{
    app::PluginsState, prelude::*, tasks::tick_global_task_pools_on_main_thread,
    time::TimeUpdateStrategy,
};

use self::flappy_bird::*;
use crate::reinforce::{sac, Agent, AgentTrainer, AgentWithTrainer};

mod flappy_bird;

#[derive(Resource)]
pub enum Control {
    Player,
    PlayerWithTrainer(Box<dyn AgentTrainer>),
    Agent(Box<dyn Agent>),
    AgentWithTrainer(Box<dyn AgentWithTrainer>),
}

struct DoNothingAgent;

impl Agent for DoNothingAgent {
    fn act(&self, _observation: &Vec<f32>) -> Vec<f32> {
        vec![0.0]
    }
}

pub fn play_flappy_bird(control: Control) {
    App::new()
        .insert_resource(control)
        .add_plugins(DefaultPlugins)
        .add_plugins(FlappyBirdPlugin::new(FlappyBirdConfig {
            with_graphics: true,
            gravity: -200.0,
            horizontal_velocity: 150.0,
            player_strength: 200.0,
            game_height: 600.0,
            game_width: 1100.0,
            obstacle_inside_space: 100.0..200.0,
            obstacle_bot_min: 50.0,
            obstacle_top_max: 50.0,
            obstacle_width: 50.0,
            obstacle_frequency: 2.0,
        }))
        .run();
}

pub fn train_flappy_bird(control: Control) {
    let mut app = App::new();

    app.insert_resource(control)
        .add_plugins(MinimalPlugins)
        .add_plugins(FlappyBirdPlugin::new(FlappyBirdConfig {
            with_graphics: false,
            gravity: -200.0,
            horizontal_velocity: 150.0,
            player_strength: 200.0,
            game_height: 600.0,
            game_width: 1100.0,
            obstacle_inside_space: 100.0..200.0,
            obstacle_bot_min: 50.0,
            obstacle_top_max: 50.0,
            obstacle_width: 50.0,
            obstacle_frequency: 2.0,
        }));

    app.world
        .insert_resource(TimeUpdateStrategy::ManualDuration(
            Duration::from_secs(1) / 60,
        ));

    let now = Instant::now();

    for _ in 0..60 * 60 * 60 {
        if app.plugins_state() != PluginsState::Cleaned {
            while app.plugins_state() == PluginsState::Adding {
                tick_global_task_pools_on_main_thread();
            }

            app.finish();
            app.cleanup();
        }

        app.update();
    }

    println!("Time per second: {:?}", now.elapsed() / (60 * 60));
    println!("Time per minute: {:?}", now.elapsed() / 60);
    println!("Time per hour: {:?}", now.elapsed());
}