use bevy::{ecs::component::Component, transform::TransformBundle};
use bevy_rapier2d::{dynamics::RigidBody, geometry::Collider};

use super::map_template::shape_template::ShapeTemplate;

#[derive(Component)]
pub struct Shape;

pub struct ShapeBundle {
    shape: Shape,

    rigid_body: RigidBody,
    collider: Collider,
    transform: TransformBundle,
}

impl ShapeBundle {
    pub fn new(template: &ShapeTemplate) -> Self {
        ShapeBundle {
            shape: Shape,
            rigid_body: RigidBody::Fixed,
            collider: template.create_collider(),
            transform: TransformBundle::IDENTITY,
        }
    }
}
