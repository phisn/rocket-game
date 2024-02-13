use bevy::{
    app::{AppLabel, SubApp},
    ecs::schedule::SystemConfigs,
    prelude::*,
    sprite::MaterialMesh2dBundle,
};
use bevy_xpbd_2d::{prelude::*, PhysicsSchedule, PhysicsStepSet};
use rapier2d::parry::bounding_volume::BoundingVolume;
use rust_game_plugin::MapTemplate;

#[derive(Event)]
pub struct ParticleSpawnEvent {
    pub position: Vec2,
    pub velocity: Vec2,
    pub size: f32,
    pub color: Color,
    pub lifetime: f32,
}

#[derive(Component)]
pub struct Particle {
    pub lifetime: i128,
}

#[derive(AppLabel, Debug, Hash, PartialEq, Eq, Clone)]
pub struct ParticleSubApp;

pub fn update() -> SystemConfigs {
    (particle_spawner, particle_lifetime).chain().into_configs()
}

fn particle_spawner(
    mut commands: Commands,
    mut particle_reader: EventReader<ParticleSpawnEvent>,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<ColorMaterial>>,
) {
    for event in particle_reader.read() {
        commands.spawn((
            Particle {
                lifetime: event.lifetime as i128,
            },
            RigidBody::Dynamic,
            Collider::cuboid(event.size, event.size),
            LockedAxes::ROTATION_LOCKED,
            LinearVelocity(event.velocity),
            MaterialMesh2dBundle {
                transform: Transform::from_translation(event.position.extend(-1.0)),
                mesh: meshes
                    .add(shape::Quad::new(Vec2::new(event.size, event.size)).into())
                    .into(),
                material: materials.add(ColorMaterial::from(Color::LIME_GREEN)),
                ..Default::default()
            },
        ));
    }
}

fn particle_lifetime(
    mut commands: Commands,
    time: Res<Time>,
    mut query: Query<(Entity, &mut Particle)>,
) {
    for (entity, mut particle) in query.iter_mut() {
        particle.lifetime -= time.delta().as_millis() as i128;

        if particle.lifetime <= 0i128 {
            commands.entity(entity).despawn();
        }
    }
}

// Collects pairs of potentially colliding entities into the BroadCollisionPairs resource provided by the physics engine.
// A brute force algorithm is used for simplicity.
pub struct BruteForceBroadPhasePlugin;

impl Plugin for BruteForceBroadPhasePlugin {
    fn build(&self, app: &mut App) {
        // Make sure the PhysicsSchedule is available
        let physics_schedule = app
            .get_schedule_mut(PhysicsSchedule)
            .expect("add PhysicsSchedule first");

        // Add the broad phase system into the broad phase set
        physics_schedule.add_systems(collect_collision_pairs.in_set(PhysicsStepSet::BroadPhase));
    }
}

fn collect_collision_pairs(
    bodies: Query<(Entity, &ColliderAabb, &RigidBody), Without<Particle>>,
    mut broad_collision_pairs: ResMut<BroadCollisionPairs>,
) {
    // Clear old collision pairs
    broad_collision_pairs.0.clear();

    // Loop through all entity combinations and collect pairs of bodies with intersecting AABBs
    for [(ent_a, aabb_a, rb_a), (ent_b, aabb_b, rb_b)] in bodies.iter_combinations() {
        // At least one of the bodies is dynamic and their AABBs intersect
        if (rb_a.is_dynamic() || rb_b.is_dynamic()) && aabb_a.0.intersects(&aabb_b.0) {
            broad_collision_pairs.0.push((ent_a, ent_b));
        }
    }
}
