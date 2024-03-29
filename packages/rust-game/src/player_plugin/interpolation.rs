use bevy::{ecs::schedule::SystemConfigs, prelude::*};
use rust_game_plugin::ecs::common::TrackingForInterpolation;

#[derive(Component)]
pub struct RocketInterpolated;

#[derive(Component)]
pub struct InterpolationCopy {
    pub copy: Entity,
}

pub fn update() -> SystemConfigs {
    (update_interpolation_copy).into_configs()
}

fn update_interpolation_copy(
    time: Res<Time<Fixed>>,
    mut interpolated: Query<(&InterpolationCopy, &TrackingForInterpolation)>,
    mut transforms: Query<&mut Transform>,
) {
    let alpha = time.overstep_fraction();

    for (mut interpolation_copy, tracking) in interpolated.iter_mut() {
        if let Ok(mut transform) = transforms.get_mut(interpolation_copy.copy) {
            transform.translation = tracking
                .previous_transform
                .translation
                .lerp(tracking.transform.translation, alpha);

            transform.rotation = tracking
                .previous_transform
                .rotation
                .lerp(tracking.transform.rotation, alpha);
        }
    }
}
